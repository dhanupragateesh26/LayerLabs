export default function PrototypingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="inline-block py-1 px-3 rounded-full bg-[#ecf0e6] border border-[#4f6b43]/30 text-[#4f6b43] text-sm font-semibold tracking-wider uppercase mb-4 shadow-sm">
        Prototyping Service
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6">
        Rapid <span className="text-[#4f6b43]">Prototyping</span>
      </h1>
      <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
        Iterate quickly and test your concepts with our rapid prototyping services. From initial mockups to functional parts.
      </p>
      <div className="card p-8 max-w-xl w-full text-left">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Start a Prototype</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Upload files (if any)</label>
            <input type="file" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Requirements</label>
            <textarea className="input-field min-h-[100px]" placeholder="Material requirements, tolerances, etc..." />
          </div>
          <button type="button" className="btn-primary w-full text-center block">Request Prototype</button>
        </form>
      </div>
    </div>
  );
}
