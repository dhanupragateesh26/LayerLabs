export default function ModellingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="inline-block py-1 px-3 rounded-full bg-[#ecf0e6] border border-[#4f6b43]/30 text-[#4f6b43] text-sm font-semibold tracking-wider uppercase mb-4 shadow-sm">
        3D Modelling Service
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6">
        Turn your sketches into <span className="text-[#4f6b43]">3D Models</span>
      </h1>
      <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
        Our expert designers will transform your ideas, concepts, and 2D sketches into production-ready 3D models.
      </p>
      <div className="card p-8 max-w-xl w-full text-left">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Request Modelling</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-1">Project Details</label>
            <textarea className="input-field min-h-[100px]" placeholder="Describe your part or idea..." />
          </div>
          <button type="button" className="btn-primary w-full text-center block">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
