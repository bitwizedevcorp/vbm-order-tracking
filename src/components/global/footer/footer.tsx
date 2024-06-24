// import { FaFacebookF } from "react-icons/fa";
// import { AiOutlineTwitter, AiFillYoutube } from "react-icons/ai";
// import { BiLogoPinterestAlt } from "react-icons/bi";
import logoImg from "../menu/vbmLogo.jpeg";
import Image from "next/image";
const Footer = () => {
  const iconsTab = [{ icon: "test" }, { icon: "test-2" }];
  return (
    <>
      <footer className="bg-white">
        <div className="container mx-auto  py-[10rem]">
          {/* footer div all */}
          <div className="flex justify-between flex-col md:flex-row  items-center md:items-start  md:gap-[5rem] text-left">
            {/* logo side */}
            <div className="flex flex-col w-1/2 md:p-0 py-4 gap-8">
              <Image src={logoImg} width={100} height={100} alt="logo" />
              <p className="text-[15px] font-medium text-[#646464]">
                Easy traking the order for the client.
              </p>
              {/* socials */}
              {/* <div className="flex gap-7 text-[18px] text-[#646464] justify-center md:justify-start">
                {iconsTab.map(({ icon }, index) => {
                  return (
                    <div
                      key={index}
                      className="text-2xl bg-[#efefef] p-2 rounded-full hover:bg-[#ff0366] hover:text-white"
                      style={{ transition: "all 0.3s" }}
                    >
                      {icon}
                    </div>
                  );
                })}
              </div> */}
              <p className="text-[16px] font-medium text-[#646464]">
                Privacy Policy | © {new Date().getFullYear()} Vital Berry
                Marketing <br /> Design by{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.listafirme.ro/bitwize-development-srl-43966221/"
                >
                  Bitwize Development
                </a>
              </p>
            </div>
            <br />
            <br />
            {/* middle div */}
            {/* <div className="flex flex-col gap-8 relative">
              <p className="text-[22px] font-bold footer-main">Menu</p>

              <span className="top-[33px] absolute w-[7rem] h-[4px] bg-[#ff0366]"></span>

              <p className="text-[16px] hover:text-[#ff0366] cursor-pointer text-[#646464] font-medium hover:font-bold">
                Home
              </p>
              <p className="text-[16px] hover:text-[#ff0366] cursor-pointer text-[#646464] font-medium hover:font-bold">
                Blog
              </p>
              <p className="text-[16px] hover:text-[#ff0366] cursor-pointer text-[#646464] font-medium hover:font-bold">
                About us
              </p>
              <p className="text-[16px] hover:text-[#ff0366] cursor-pointer text-[#646464] font-medium hover:font-bold">
                Contact us
              </p>
            </div> */}

            {/* right div */}
            {/* <div className="flex flex-col gap-8 relative">
              <p className="text-[22px] font-bold footer-main">Working Hours</p>

              <span className="top-[33px] absolute w-[7rem] h-[4px] bg-[#ff0366]"></span>

              <p className="text-[16px]  text-[#646464] font-bold">
                Monday - Friday:
              </p>
              <p className="text-[16px] text-[#646464] font-medium">
                7:00am - 21:00pm
              </p>
              <p className="text-[16px] text-[#646464] font-bold">Saturday:</p>
              <p className="text-[16px] text-[#646464] font-medium">
                7:00am - 19:00pm
              </p>
              <p className="text-[16px] text-[#646464] font-bold ">
                Sunday - Closed
              </p>
            </div> */}

            {/* middle div */}
            <span></span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
