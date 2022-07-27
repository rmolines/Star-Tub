import { useRouter } from 'next/router';

export default function Example() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center bg-white">
      <div className="flex max-w-6xl grow flex-col justify-start p-10 xl:px-0">
        {/* <!-- nav --> */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 text-4xl font-semibold text-gray-900">
              <img src="/clam.svg" className="w-12" alt="clam" />
              Clam
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => router.push('/')}
              className="rounded-3xl bg-gradient-to-b from-gray-900 to-black px-6 py-3 font-medium text-white outline-none"
            >
              Login
            </button>
          </div>
        </div>
        {/* <!-- /nav --> */}

        {/* <!-- hero section --> */}
        <div className="mt-20 flex grow flex-col justify-center text-left lg:mt-40 lg:ml-16">
          <div className="text-5xl font-semibold leading-none text-gray-900 md:text-6xl">
            Encontre. Converse. Capte. <br />
            Os melhores fundos de VC do Brasil em um só lugar.
          </div>
          <div className="text-true-gray-500 mt-6 text-xl font-light antialiased">
            Aqui você encontra os melhores investidores pro futuro da sua
            startup.
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-fit rounded-full bg-gradient-to-b from-clam-700 to-clam-500 px-8 py-4 font-normal tracking-wide text-white outline-none"
          >
            Cadastre sua Startup Aqui!
          </button>
        </div>
      </div>

      {/* <div className="flex h-60 w-screen justify-center bg-slate-500">
        <div className="flex w-[72rem] items-center gap-8 px-8">
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
        </div>
      </div> */}
      {/* <!-- /hero section --> */}
    </div>
  );
}
