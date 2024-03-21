import Image from 'next/image'
import SideNav from './SideNav'
import { Icons } from '../../../utils/Icon'

const Sidebar = () => {
    return (
        <div className='bg-[#111C43] h-screen sticky top-0 left-0 z-50'>
            <div className="p-3 flex flex-col justify-around h-screen">
                <div className="w-[90%] flex flex-col items-center">
                    <Image
                        src='https://avatars.githubusercontent.com/u/63503994?s=400&u=cf011d265ff41277324c337816e6d8220f49c861&v=4'
                        alt='profile-pic'
                        width={120}
                        height={120}
                        className='rounded-full border-3 border-[white]'
                    />
                    <h5 className='pt-3 text-2xl'>Mika - Mimi</h5>
                </div>
                {/* Side nav */}
                <SideNav />
                <div className='flex items-center pl-3 cursor-pointer'>
                    <span className='text-3xl'>{Icons.logOut}</span>
                    <span className='block text-2xl px-2'>Log Out</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar