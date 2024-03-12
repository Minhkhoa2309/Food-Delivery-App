import { REGISTER_USER } from '@/src/graphql/actions/register.action';
import styles from '@/src/utils/style'
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long!'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters long!'),
    phone_number: z.number().min(9, "Phone number must be at least 10 characters long!")
})

type SignupSchema = z.infer<typeof formSchema>;

const Signup = ({ setActiveState }: { setActiveState: (e: string) => void }) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<SignupSchema>({
        resolver: zodResolver(formSchema)
    });

    const [show, setShow] = useState(false);
    const [registerUserMutation, { loading, error, data }] = useMutation(REGISTER_USER);

    const onSubmit = async (data: SignupSchema) => {
        try {
            const response = await registerUserMutation({
                variables: data
            })
            localStorage.setItem('activation_token', response.data.register.activation_token);
            toast.success('Please check your email to activate your account!');
            reset();
            setActiveState('Verification');
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <br />
            <h1 className={`${styles.title}`}>
                Signup with FastDeli
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='w-full mt-5 relative mb-3'>
                    <label className={`${styles.label}`}>Enter your Name</label>
                    <input {...register("name")} type="text" placeholder='John Doe' className={`${styles.input}`} />
                    {
                        errors.name && (
                            <span className='text-red-500 block mt-1'>
                                {errors.name.message}
                            </span>
                        )
                    }
                </div>
                <label className={`${styles.label}`}>Enter your Phone Number</label>
                <input {...register("phone_number", { valueAsNumber: true })} type="number" placeholder='+8497********' className={`${styles.input}`} />
                {
                    errors.phone_number && (
                        <span className='text-red-500 block mt-1'>
                            {errors.phone_number.message}
                        </span>
                    )
                }
                <div className='w-full mt-5 relative mb-3'>
                    <label className={`${styles.label}`}>Enter your Email</label>
                    <input {...register("email")} type="text" placeholder='JohnDoe@gmail.com' className={`${styles.input}`} />
                    {
                        errors.email && (
                            <span className='text-red-500 block mt-1'>
                                {errors.email.message}
                            </span>
                        )
                    }
                </div>
                <div className='w-full mt-5 relative mb-1'>
                    <label htmlFor='password' className={`${styles.label}`}>Enter your Password</label>
                    <input
                        {...register("password")}
                        type={!show ? 'password' : 'text'}
                        placeholder='password!@%'
                        className={`${styles.input}`}
                    />
                    {
                        !show ? (
                            <AiOutlineEyeInvisible
                                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                                size={20}
                                onClick={() => setShow(true)}
                            />
                        ) : (
                            <AiOutlineEye
                                className='absolute bottom-3 right-2 z-1 cursor-pointer'
                                size={20}
                                onClick={() => setShow(false)}
                            />
                        )
                    }
                </div>
                {
                    errors.password && (
                        <span className='text-red-500 block mt-1'>
                            {errors.password.message}
                        </span>
                    )
                }
                <div className='w-full mt-5'>
                    <input type="submit" value='Sign Up' className={`${styles.button} mt-3`} disabled={isSubmitting || loading} />
                </div>
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-white'>
                    Or join with
                </h5>
                <div className='flex items-center justify-center my-3'>
                    <FcGoogle size={30} className='cursor-pointer mr-2' />
                    <AiFillGithub size={30} className='cursor-pointer mr-2' />
                </div>
                <h5 className='text-center pt-4 font-Poppins text-[14px]'>
                    Already have an account?
                    <span
                        onClick={() => setActiveState("Login")}
                        className='text-[#2190ff] pl-1 cursor-pointer'
                    >
                        Login
                    </span>
                </h5>
                <br />
            </form>
        </div>
    )
}

export default Signup