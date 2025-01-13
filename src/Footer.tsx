import { APP_VERSION } from './version';

const Footer = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <p>Wersja: {APP_VERSION}</p>
    </div>
  );
};

export default Footer;
