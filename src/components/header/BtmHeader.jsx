
import { IoMdMenu } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
export default function BtmHeader() {


  return (
    <div className="btm_header">
      <div className="container">
        <nav className="nav">
          <div className="category_nav">
            <div className="category_btm">
              <IoMdMenu />
              <p>list</p>
              <IoIosArrowDown />
            </div>
            <div className="category_nav_list"> </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
