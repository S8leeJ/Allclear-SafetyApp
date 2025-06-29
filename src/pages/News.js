export default function News() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
      <div class='max-w-6xl mx-auto px-4 py-8'>
        <div class='flex flex-col items-center mb-10'>
          <span class='text-5xl md:text-5xl font-extrabold text-blue-300  drop-shadow-lg mb-4 animate-pulse'>Severe Weather Alerts</span>
          <div class='w-24 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full mb-2'></div>
          <span class='text-base text-gray-300 italic'>Stay informed. Stay safe.</span>
        </div>
        <div class='grid grid-cols-1 md:grid-cols-3 grid-rows-4 md:grid-rows-2 gap-4'>
          <div class='md:row-span-2 md:col-span-2 row-span-1 h-64 md:h-auto'>
            <a href='#' class='block h-full w-full group'>
              <div class='relative h-full w-full rounded-lg overflow-hidden cursor-pointer group-hover:ring-4 group-hover:ring-blue-400/40 transition'>
                <img src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' alt='Tornado Warning' class='absolute inset-0 w-full h-full object-cover' />
                <div class='absolute inset-0 bg-black/60'></div>
                <div class='relative z-10 flex flex-col justify-end h-full p-6'>
                  <span class='bg-red-600 text-xs font-bold uppercase rounded px-3 py-1 mb-2 w-fit'>Tornado Warning</span>
                  <h2 class='text-2xl md:text-3xl font-bold mb-2'>Tornado Warning Issued for Oklahoma City</h2>
                  <p class='text-gray-200 text-sm mb-1'>Seek shelter immediately as a tornado has been spotted in the area.</p>
                  <span class='text-gray-400 text-xs'>Oklahoma City, OK &bull; 28 Jun 2025</span>
                </div>
              </div>
            </a>
          </div>
          <div class='h-40 md:h-36'>
            <a href='#' class='block h-full w-full group'>
              <div class='relative h-full w-full rounded-lg overflow-hidden cursor-pointer group-hover:ring-4 group-hover:ring-blue-400/40 transition'>
                <img src='https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' alt='Thunderstorm Alert' class='absolute inset-0 w-full h-full object-cover' />
                <div class='absolute inset-0 bg-black/60'></div>
                <div class='relative z-10 flex flex-col justify-end h-full p-4'>
                  <span class='bg-yellow-400 text-xs font-bold uppercase rounded px-2 py-1 mb-1 w-fit text-black'>Thunderstorm Alert</span>
                  <h3 class='text-lg font-semibold leading-tight'>Severe Thunderstorm Approaching Dallas</h3>
                  <span class='text-gray-400 text-xs mt-1'>Dallas, TX &bull; 28 Jun 2025</span>
                </div>
              </div>
            </a>
          </div>
          <div class='h-40 md:h-36'>
            <a href='#' class='block h-full w-full group'>
              <div class='relative h-full w-full rounded-lg overflow-hidden cursor-pointer group-hover:ring-4 group-hover:ring-blue-400/40 transition'>
                <img src='https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80' alt='Flood Watch' class='absolute inset-0 w-full h-full object-cover' />
                <div class='absolute inset-0 bg-black/60'></div>
                <div class='relative z-10 flex flex-col justify-end h-full p-4'>
                  <span class='bg-blue-600 text-xs font-bold uppercase rounded px-2 py-1 mb-1 w-fit'>Flood Watch</span>
                  <h3 class='text-lg font-semibold leading-tight'>Flood Watch in Effect for Houston</h3>
                  <span class='text-gray-400 text-xs mt-1'>Houston, TX &bull; 28 Jun 2025</span>
                </div>
              </div>
            </a>
          </div>
          <div class='md:col-span-2 h-40 md:h-36'>
            <a href='#' class='block h-full w-full group'>
              <div class='relative h-full w-full rounded-lg overflow-hidden cursor-pointer group-hover:ring-4 group-hover:ring-blue-400/40 transition'>
                <img src='https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80' alt='Heat Advisory' class='absolute inset-0 w-full h-full object-cover' />
                <div class='absolute inset-0 bg-black/60'></div>
                <div class='relative z-10 flex flex-col justify-end h-full p-4'>
                  <span class='bg-orange-500 text-xs font-bold uppercase rounded px-2 py-1 mb-1 w-fit'>Heat Advisory</span>
                  <h3 class='text-lg font-semibold leading-tight'>Extreme Heat Advisory for Phoenix</h3>
                  <span class='text-gray-400 text-xs mt-1'>Phoenix, AZ &bull; 28 Jun 2025</span>
                </div>
              </div>
            </a>
          </div>
          <div class='h-40 md:h-36'>
            <a href='#' class='block h-full w-full group'>
              <div class='relative h-full w-full rounded-lg overflow-hidden cursor-pointer group-hover:ring-4 group-hover:ring-blue-400/40 transition'>
                <img src='https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80' alt='Winter Storm Warning' class='absolute inset-0 w-full h-full object-cover' />
                <div class='absolute inset-0 bg-black/60'></div>
                <div class='relative z-10 flex flex-col justify-end h-full p-4'>
                  <span class='bg-cyan-300 text-xs font-bold uppercase rounded px-2 py-1 mb-1 w-fit text-black'>Winter Storm Warning</span>
                  <h3 class='text-lg font-semibold leading-tight'>Heavy Snowfall Expected in Denver</h3>
                  <span class='text-gray-400 text-xs mt-1'>Denver, CO &bull; 28 Jun 2025</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    `}} />
  );
}
