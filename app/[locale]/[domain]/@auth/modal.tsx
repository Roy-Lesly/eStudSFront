'use client';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    return (
        <div className="bg-black bg-opacity-70 fixed flex inset-0 items-center justify-center z-50">
        <div className="bg-white max-w-md p-8 rounded-lg shadow-lg text-center w-11/12">
            <h2 className="font-semibold mb-4 text-2xl">Session Expired</h2>
            <p className="mb-6 text-gray-600">Please log in to continue.</p>
            <button
                onClick={() => router.push('/pageAuthentication/Login')}
                className="bg-blue-600 font-medium hover:bg-blue-700 py-2 rounded text-white transition w-full"
            >
                Go to Login
            </button>
        </div>
    </div>
    );
}


export default Login;