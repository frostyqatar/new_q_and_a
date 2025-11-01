'use client'

interface CodeDisplayProps {
  code: string
  className?: string
}

export function CodeDisplay({ code, className }: CodeDisplayProps) {
  return (
    <div className={`${className} backdrop-blur-md bg-slate-800/80 text-slate-100 p-5 rounded-xl overflow-x-auto text-left border border-slate-600/50 shadow-2xl shadow-slate-900/20`} dir="ltr">
      <pre className="font-mono text-sm text-left leading-relaxed m-0" style={{ fontFamily: '"Fira Code", "Courier New", monospace', direction: 'ltr' }}>
        <code className="text-slate-50" dir="ltr">{code}</code>
      </pre>
    </div>
  )
}

