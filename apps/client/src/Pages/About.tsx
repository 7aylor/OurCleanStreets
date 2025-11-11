import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 py-12 text-gray-800'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>
        About OurCleanStreets
      </h1>

      <section className='mb-10'>
        <p className='text-lg leading-relaxed mb-4'>
          According to a 2020 study by{' '}
          <Link
            to='https://kab.org/litter/litter-study/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-green-600 hover:underline'
          >
            Keep America Beautiful
          </Link>{' '}
          there are approximately 50 billion pieces of litter on the ground in
          the US, roughly 152 pieces of litter per American, or 2605 pieces of
          litter per mile of road and waterway in the country. OurCleanStreets
          aims to empower communities to work together to tackle the litter
          epidemic, one step at a time.
        </p>
        <p className='text-lg leading-relaxed'></p>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-4 text-gray-900'>
          Attributions
        </h2>
        <ul className='list-disc pl-6 space-y-2 text-gray-700'>
          <li>
            <Link
              to='https://www.flaticon.com/free-icons/planet'
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-600 hover:underline'
            >
              Planet icons
            </Link>{' '}
            created by Freepik - Flaticon
          </li>
          <li>
            Map Routing powered by ©{' '}
            <Link
              to='https://openrouteservice.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-600 hover:underline'
            >
              openrouteservice.org
            </Link>{' '}
            by HeiGIT | Map data © OpenStreetMap contributors
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About;
