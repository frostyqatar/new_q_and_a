'use client'

interface CodeDisplayProps {
  code: string
  className?: string
}

export function CodeDisplay({ code, className }: CodeDisplayProps) {
  return (
    <div className={`${className} bg-slate-800 text-slate-100 p-5 rounded-xl overflow-x-auto text-left border border-slate-700 shadow-lg`}>
      <pre className="font-mono text-sm text-left leading-relaxed m-0" style={{ fontFamily: '"Fira Code", "Courier New", monospace' }}>
        <code className="text-slate-50">{code}</code>
      </pre>
    </div>
  )
}

