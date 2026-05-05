import time
import json
import os

def run_benchmark(func, iterations=1000):
    """Measures execution time of a function."""
    start = time.perf_counter()
    for _ in range(iterations):
        func()
    end = time.perf_counter()
    return (end - start) / iterations

def save_report(data, filename="benchmarks/latest.json"):
    """Saves benchmark results to a standard JSON format."""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Benchmark report saved to: {filename}")

if __name__ == "__main__":
    # Example logic to benchmark
    def example_task():
        sum(i for i in range(10000))

    avg_time = run_benchmark(example_task)
    report = {
        "timestamp": time.time(),
        "task": "sum_range_10000",
        "average_execution_seconds": avg_time,
        "iterations": 1000
    }
    save_report(report)
