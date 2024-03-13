import { FORGOT_PASSWORD } from '@/src/graphql/actions/forgotPassword.action';
import styles from '@/src/utils/style'
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().email()
})

type ForgotPasswordSchema = z.infer<typeof formSchema>;

const ForgotPassword = ({ setActiveState, }: { setActiveState: (e: string) => void }) => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(formSchema)
    });

    const [forgotPassword, { loading, error, data }] = useMutation(FORGOT_PASSWORD);

    const onSubmit = async (data: ForgotPasswordSchema) => {
        try {
            const response = await forgotPassword({
                variables: data
            })
            toast.success("Please check your email to reset your password!");
            reset();
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div>
            <br />
            <h1 className={`${styles.title}`}>
                Forgot your password
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className={`${styles.label}`}>Enter your Email</label>
                <input {...register("email")} type="email" placeholder='loginmail@gmail.com' className={`${styles.input}`} />
                {
                    errors.email && (
                        <span className='text-red-500 block mt-1'>
                            {errors.email.message}
                        </span>
                    )
                }
                <br />
                <input type="submit" value='Submit' className={`${styles.button} mt-3`} disabled={isSubmitting || loading} />
                <br />
                <h5 className='text-center pt-4 font-Poppins text-[14px]'>
                    Or Go Back to
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

export default ForgotPassword