import Logo from '../../assets/IEEEAAST.ico';
import { Link } from 'react-router-dom';

export const LogoButton = () => {
    return (
      <div className="ml-[40vw] sm:ml-[20px]">
        <Link to="/">
          <img src={Logo} alt="IEEE branch logo" height={90} width={90} />
        </Link>
      </div>
    );
  }
