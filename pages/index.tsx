import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <Head>
        <title>Mapiful Clone</title>
      </Head>
      <h1 className="text-4xl font-bold mb-4">Design Your Own Custom Map Poster</h1>
      <p className="mb-8 text-lg text-gray-700">Pick any location and create a beautiful printable map.</p>
      <Link href="/editor">
        <button className="bg-black text-white px-6 py-3 rounded-full hover:opacity-80">Get Started</button>
      </Link>
    </div>
  )
}
