'use client'

import { CiSearch } from "react-icons/ci";
import { useStateContext } from "../../context/StateContext";

const ChannelSearch = () => {
    const {channelQuery, setChannelQuery, isPreviewing} = useStateContext()
    const handleSearch = (e) => {
        setChannelQuery(e.target.value)
    }
    return (
        <div className={`absolute px-4 py-5 ${!isPreviewing && 'sm:block hidden'}`}>
            <div className="relative">
                <div className="absolute right-5 top-2.5">
                    <CiSearch size={27} />
                </div>
                <input 
                    className="sm:w-[21vw] w-[92vw] h-[50px] rounded-[40px] ring-1 ring-inset ring-slate-200 px-5"
                    placeholder="Search..."
                    type='text'
                    value={channelQuery}
                    onChange={handleSearch}
                />
            </div>
        </div>
    )
    }

export default ChannelSearch