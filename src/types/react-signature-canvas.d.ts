declare module 'react-signature-canvas' {
  import * as React from 'react';

  export interface SignatureCanvasProps {
    velocityFilterWeight?: number;
    minWidth?: number;
    maxWidth?: number;
    minDistance?: number;
    dotSize?: number | (() => number);
    penColor?: string;
    throttle?: number;
    onEnd?: () => void;
    onBegin?: () => void;
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    backgroundColor?: string;
  }

  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    on(): void;
    off(): void;
    clear(): void;
    isEmpty(): boolean;
    fromDataURL(base64String: string, options?: any): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromData(pointGroupData: any[]): void;
    toData(): any[];
    getCanvas(): HTMLCanvasElement;
    getTrimmedCanvas(): HTMLCanvasElement;
    getSignaturePad(): any;
  }
}
