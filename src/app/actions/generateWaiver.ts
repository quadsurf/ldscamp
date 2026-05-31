'use server'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { createClient } from '@/lib/supabase/server'

export async function generateAndUploadWaiver(
  attendeeId: string,
  registrationData: any,
  stakeSlug: string
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    const supabase = await createClient()

    // 1. Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()
    
    // Add a blank page to the document
    const page = pdfDoc.addPage([600, 800])
    
    // Get fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    let yOffset = height - 50
    
    const drawText = (text: string, font = helveticaFont, size = 12, x = 50) => {
      page.drawText(text, {
        x,
        y: yOffset,
        size,
        font,
        color: rgb(0, 0, 0),
      })
      yOffset -= (size + 10)
    }

    // Header
    drawText('Camp Registration & Waiver Form', helveticaBold, 20)
    yOffset -= 10

    // About Teenager
    drawText('1. About Your Teenager', helveticaBold, 14)
    drawText(`Name: ${registrationData.firstName} ${registrationData.lastName}`)
    drawText(`Date of Birth: ${registrationData.dob} | Age: ${registrationData.age}`)
    drawText(`Gender: ${registrationData.gender} | Youth Level: ${registrationData.youthLevel}`)
    drawText(`T-shirt Size: ${registrationData.tshirtSize}`)
    drawText(`Phone: ${registrationData.cellPhone || 'N/A'}`)
    drawText(`Email: ${registrationData.email || 'N/A'}`)
    drawText(`Home Address: ${registrationData.homeAddress}`)
    yOffset -= 10

    // Health Info
    drawText('2. Health Information', helveticaBold, 14)
    drawText(`Special Diet: ${registrationData.specialDiet || 'None'}`)
    drawText(`Allergies: ${registrationData.allergies || 'None'}`)
    drawText(`Medications: ${registrationData.medications || 'None'}`)
    drawText(`Chronic Illness: ${registrationData.chronicIllness || 'None'}`)
    drawText(`Physical Conditions: ${registrationData.physicalConditions || 'None'}`)
    drawText(`Anxiety: ${registrationData.anxiety || 'None'}`)
    yOffset -= 10

    // Permissions
    drawText('3. Permissions & Authorizations', helveticaBold, 14)
    drawText(`OTC Consent: ${registrationData.otcConsent ? 'Yes' : 'No'}`)
    drawText(`Social Media Release: ${registrationData.socialMediaRelease ? 'Yes' : 'No'}`)
    drawText(`Emergency Treatment Auth: ${registrationData.emergencyAuth ? 'Yes' : 'No'}`)
    yOffset -= 10
    
    // Terms
    drawText('4. Terms & Conduct', helveticaBold, 14)
    drawText(`Agreed to Conduct Rules: ${registrationData.conductAgreement ? 'Yes' : 'No'}`)
    drawText(`Acknowledged Privileges: ${registrationData.privilegeAck ? 'Yes' : 'No'}`)
    yOffset -= 10

    // Signature
    drawText('5. Signature', helveticaBold, 14)
    drawText(`Date: ${registrationData.signatureDate}`)
    
    // Embed signature image if exists
    if (registrationData.signatureDataUrl) {
      try {
        // Remove the data:image/png;base64, prefix
        const base64Data = registrationData.signatureDataUrl.replace(/^data:image\/png;base64,/, "")
        const imageBytes = Buffer.from(base64Data, 'base64')
        const signatureImage = await pdfDoc.embedPng(imageBytes)
        
        const sigDims = signatureImage.scale(0.5)
        
        if (yOffset - sigDims.height < 50) {
            // Need a new page for signature? Simplified handling for MVP
        }
        
        page.drawImage(signatureImage, {
          x: 50,
          y: yOffset - sigDims.height,
          width: sigDims.width,
          height: sigDims.height,
        })
      } catch (err) {
        console.error("Error embedding signature", err)
      }
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // 2. Upload to Supabase Storage
    const fileName = `${stakeSlug}/${attendeeId}_waiver.pdf`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('waivers')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading waiver PDF:', uploadError)
      return { success: false, error: uploadError.message }
    }
    
    const { data: urlData } = await supabase
      .storage
      .from('waivers')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 year signed URL for MVP simplicity

    const pdfUrl = urlData?.signedUrl || fileName

    // 3. Update the attendee record
    const { error: updateError } = await supabase
      .from('camp_attendees')
      .update({ waiver_pdf_url: pdfUrl })
      .eq('id', attendeeId)

    if (updateError) {
       console.error('Error updating attendee with waiver URL:', updateError)
       return { success: false, error: updateError.message }
    }
    
    // 4. (Future) Email to Parent

    return { success: true, url: pdfUrl }

  } catch (error: any) {
    console.error('generateAndUploadWaiver failed:', error)
    return { success: false, error: error.message }
  }
}
