import person1 from '../assets/exampleartists/person1.jpg'
import person2 from '../assets/exampleartists/person2.jpg'
import person3 from '../assets/exampleartists/person3.jpg'
import person4 from '../assets/exampleartists/person4.jpg'
import Image from 'next/image'
const people = [
  {
    name: 'Diego Fernandezs',
    role: 'Sculptor',
    imageUrl:person1,
    bio: 'Diego Fernandezs sculptures defy convention, exploring surreal and thought-provoking designs that challenge viewers perceptions of reality.',
  },
  {
    name: 'Isabella Santos',
    role: 'Painter',
    imageUrl:person2,
    bio: 'Isabella Santoss abstract paintings express emotion and intuition through bold brushstrokes and vibrant colors, inviting viewers on a journey of self-discovery.',
  },
  {
    name: 'Eduardo Rivera',
    role: 'Realistic Portrait Painter',
    imageUrl:person3,
    bio: 'Eduardo Rivera creates stunningly realistic portraits, capturing the essence of his subjects with meticulous attention to detail and depth.',
  },
  {
    name: 'Sophia Ramirez',
    role: 'Mixed Media Collage Artist',
    imageUrl:person4,
    bio: 'Sophia Ramirezs mixed media collages are rich in texture, color, and symbolism, celebrating diversity and resilience in the human experience.',
  },
  // More people...
]

const FeaturedArtists = () => {
  return (
    <div className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Artists</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          Step into the mesmerizing world of our curated featured artists, where each brushstroke, photograph, and sculpture tells a unique story of passion, perseverance, and boundless creativity.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
        >
          {people.map((person,i) => (
            <li key={person.name}>
              <Image className="aspect-[3/2] w-full rounded-2xl object-cover" src={person.imageUrl} width='auto' height='auto' alt="person" />
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">{person.name}</h3>
              <p className="text-base leading-7 text-gray-600">{person.role}</p>
              <p className="mt-4 text-base leading-7 text-gray-600">{person.bio}</p>
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FeaturedArtists