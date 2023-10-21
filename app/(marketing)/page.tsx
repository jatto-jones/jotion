import Heroes from "./_components/Heroes"
import Heading from "./_components/Heading"
import Footer from "./_components/Footer"

const page = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className='flex flex-col justify-center items-center md:justify-start flex-1 text-center gap-y-8 px-6 pb-10'>
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  )
}

export default page