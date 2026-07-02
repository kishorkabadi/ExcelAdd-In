export function initOffice(): void {
  // Office initialization complete
  console.log('Office environment initialized')
}

export async function runInContext<T>(callback: (context: Excel.RequestContext) => Promise<T>): Promise<T> {
  return Excel.run(callback)
}
