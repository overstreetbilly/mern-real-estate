import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserFailure,
    signOutUserSuccess,
} from "../redux/user/userSlice.js";

import { useDispatch } from "react-redux";

const Profile = () => {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [formData, setFromData] = useState({});

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },

            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFromData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };

    const handleChange = (e) => {
        setFromData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(data.message));
        }
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                />
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    width={200}
                    alt='Profile'
                    className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                />
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='tex-red-700'>
                            Error Uploading Image (image must be less than 2 mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>
                            {`Uploading ${filePerc}%`}
                        </span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>
                            Image Successfully Uploaded!
                        </span>
                    ) : (
                        ""
                    )}
                </p>
                <input
                    type='text'
                    placeholder='username'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    id='username'
                    defaultValue={currentUser.username}
                />
                <input
                    type='text'
                    placeholder='email'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    id='email'
                    defaultValue={currentUser.email}
                />
                <input
                    type='password'
                    placeholder='password'
                    className='border p-3 rounded-lg'
                    onChange={handleChange}
                    id='password'
                />
                <button
                    disabled={loading}
                    className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-70'
                >
                    {loading ? "Loading..." : "Update"}
                </button>
            </form>
            <div className='flex justify-between mt-5'>
                <span
                    onClick={handleDeleteUser}
                    className='text-red-700 cursor-pointer'
                >
                    Delete Account
                </span>
                <span
                    onClick={handleSignOut}
                    className='text-red-700 cursor-pointer'
                >
                    Sign Out
                </span>
            </div>
            <p className='text-red-700 mt-5'>{error ? error : ""}</p>
            <p className='text-green-700 mt-5'>
                {updateSuccess ? "User updated successfully!" : ""}
            </p>
        </div>
    );
};

export default Profile;
