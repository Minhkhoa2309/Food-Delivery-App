'use client'
import { RESET_PASSWORD } from '@/src/graphql/actions/resetPassword.action';
import styles from '@/src/utils/style'
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { z } from 'zod'

const formSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters long!'),
    confirmPassword: z.string()
}).refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    {
        message: 'Passwords do not match!',
        path: ['confirmPassword']
    }
)

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({ activationToken }: { activationToken: string | string[] }) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(formSchema)
    });

    const [resetPasswordMutation, { loading, error, data }] = useMutation(RESET_PASSWORD);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit = async (data: ResetPasswordSchema) => {
        try {
            const response = await resetPasswordMutation({
                variables: {
                    password: data.password,
                    activationToken
                }
            })
            toast.success('Password updated successfully!');
            reset();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div className='w-full flex justify-center items-center h-screen'>
            <div className='md:w-[500px] w-full'>
                <br />
                <h1 className={`${styles.title}`}>
                    Reset Password with FastDeli
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <div className='w-full mt-5 relative mb-1'>
                        <label htmlFor='password' className={`${styles.label}`}>Enter your Confirm Password</label>
                        <input
                            {...register("confirmPassword")}
                            type={!showConfirm ? 'confirmPassword' : 'text'}
                            placeholder='password!@%'
                            className={`${styles.input}`}
                        />
                        {
                            !showConfirm ? (
                                <AiOutlineEyeInvisible
                                    className='absolute bottom-3 right-2 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShowConfirm(true)}
                                />
                            ) : (
                                <AiOutlineEye
                                    className='absolute bottom-3 right-2 z-1 cursor-pointer'
                                    size={20}
                                    onClick={() => setShowConfirm(false)}
                                />
                            )
                        }
                    </div>
                    {
                        errors.confirmPassword && (
                            <span className='text-red-500 block mt-1'>
                                {errors.confirmPassword.message}
                            </span>
                        )
                    }

                    <br />
                    <div className='w-full mt-5'>
                        <input type="submit" value='Reset Password' className={`${styles.button} mt-3`} disabled={isSubmitting || loading} />
                    </div>
                    <br />
                </form>
            </div>
        </div>
    )
}

export default ResetPassword