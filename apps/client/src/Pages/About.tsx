import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 py-12 text-gray-800'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>
        About OurCleanStreets
      </h1>

      <section className='mb-4'>
        <p className='text-lg leading-relaxed mb-4'>
          According to a 2020 study by{' '}
          <Link
            to='https://kab.org/litter/litter-study/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-green-600 hover:underline'
          >
            Keep America Beautiful
          </Link>
          , there are an estimated <strong>50 billion pieces of litter</strong>{' '}
          on the ground across the United States — roughly{' '}
          <strong>152 pieces per person</strong> or about{' '}
          <strong>2,605 pieces per mile</strong> of road and waterway.{' '}
          <span className='font-medium'>OurCleanStreets</span> empowers
          communities to take collective action against this growing problem —
          bringing people together to restore and protect the places they live,
          work, and play.
        </p>

        <p className='text-lg leading-relaxed'>
          <span className='font-medium'>OurCleanStreets</span> was developed as
          a student capstone project at{' '}
          <Link
            to='https://sites.google.com/asu.edu/goee-graduate-success-website/mse-es-software-engineering?authuser=0'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#8C1D40] font-bold hover:underline'
          >
            Arizona State University
          </Link>
          . While it strives to deliver a functional and high-quality
          experience, it remains a work in progress and may not yet be fully
          production-ready. As features continue to evolve, user data may not be
          permanently retained. We appreciate your understanding and feedback as
          the project grows.
        </p>
      </section>

      <section className='mb-4'>
        <h2 className='text-2xl font-semibold mb-2 text-gray-900'>Privacy</h2>
        <p className='text-lg leading-relaxed'>
          Privacy is a core value of OurCleanStreets. We only collect the
          information you choose to share with us, and we use it solely to
          support the features you interact with. Your ZIP code is used only to
          connect you with a default community and is never used for tracking or
          identification. Any route or location data is stored only for the
          cleanup activities you explicitly create, and it is never collected
          passively in the background. We are committed to keeping your
          information secure, minimizing what we store, and being transparent
          about how your data is used so you can confidently participate in
          keeping your community clean without worrying about your data.
        </p>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-2 text-gray-900'>
          Attributions
        </h2>
        <ul className='text-lg leading-relaxed list-disc pl-6 space-y-2 text-gray-700'>
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
            All other icons by ©{' '}
            <Link
              to='https://lucide.dev/icons/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-600 hover:underline'
            >
              Lucide Contributors
            </Link>
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
