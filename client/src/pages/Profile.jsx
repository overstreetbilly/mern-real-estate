const Profile = () => {
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h2 className='text-3xl text-center font-semibold my-7'>Profile</h2>
            <img
                src='https://picsum.photos/200'
                width={200}
                alt='Profile Photo'
                className='rounded-full'
            />
        </div>
    );
};

export default Profile;
