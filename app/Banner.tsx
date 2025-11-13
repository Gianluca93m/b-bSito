export default function Banner() {
  return (
    <div className="w-full h-[65vh] relative mb-0 overflow-hidden rounded-2xl shadow-lg border border-[#bfae82]">
      <img
        src="https://www.turismovieste.it/index/wp-content/uploads/2024/02/ostunialtramonto.jpg"
        alt="Ostuni Puglia"
        className="w-full h-full object-cover"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 bg-[#e9e5da]/60 flex flex-col justify-center items-center">        <p className="text-xl md:text-2xl text-[#4d5c3a] font-serif drop-shadow mb-4">Relax, natura e ospitalità nel cuore della Puglia</p>
      </div>
    </div>
  );
}
