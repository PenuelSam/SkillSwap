import { BiMenu, BiSearch } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";

type TopBarProps = {
  pageTitle: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const TopBar = ({ pageTitle, sidebarOpen, setSidebarOpen }: TopBarProps) => {
  return (
    <header className="bg-white border-b border-gray-200  h-16 shadow flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
        >
          <BiMenu size={20} />
        </button>
        
        {/* Page Title */}
        {/* <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1> */}
      </div>
      
      <div className="flex w-full items-center ">
        {/* Search Bar */}
        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search skills..."
            className="
              block w-full pl-10 pr-3 py-2  rounded-full
               text-[16px] font-HelveticaReg placeholder-gray-500 
               shadow-md outline-none
            "
          />
        </div>
        
        {/* Mobile Search Button */}
        <button className="sm:hidden p-2 rounded-full hover:bg-gray-100">
          <BiSearch size={18} className="text-gray-600" />
        </button>
        
        
      </div>

      {/* Profile Avatar */}
        {/* <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <BsPeople size={16} className="text-gray-600" />
        </div> */}
    </header>
  );
};
