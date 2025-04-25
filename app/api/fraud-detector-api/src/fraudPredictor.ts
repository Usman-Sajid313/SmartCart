import { PythonShell } from 'python-shell';

export function predictFraud(input: any): Promise<{ isFraud: boolean, riskScore: number }> {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      args: [JSON.stringify(input)]
    };

    
    (PythonShell.run as any)('/Users/abdulhadi/Desktop/fraud-detector-api/src/run_model.py', options, (err: any, result: any[]) => {
      if (err) return reject(err);
      if (result && result[0]) {
        resolve(result[0]);
      } else {
        reject(new Error("No result from model prediction"));
      }
    });
  });
}
