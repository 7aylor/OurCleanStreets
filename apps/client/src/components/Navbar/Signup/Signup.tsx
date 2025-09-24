const Signup = () => {
  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-2xl shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Sign Up</h2>

        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 font-medium mb-2'
          >
            Email
          </label>
          <input
            type='email'
            name='email'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter your email'
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block text-gray-700 font-medium mb-2'
          >
            Password
          </label>
          <input
            type='password'
            name='password'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter your password'
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block text-gray-700 font-medium mb-2'
          >
            Re-Enter Password
          </label>
          <input
            type='password'
            name='password'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Re-Enter your password'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200'
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;
