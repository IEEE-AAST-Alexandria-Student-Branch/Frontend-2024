import Logo from '../../assets/IEEEAAST.ico';
import { Link } from 'react-router-dom';

interface LogoButtonProps {
  className?: string;
}

export const LogoButton: React.FC<LogoButtonProps> = ({ className }) => {
  return (
    <div className={`ml-[40vw] sm:ml-[20px] ${className || ''}`}>
      <Link to="/">
        <img src={Logo} alt="IEEE branch logo" height={90} width={90} />
      </Link>
    </div>
  );
};
