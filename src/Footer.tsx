import { APP_VERSION } from './version';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', marginTop: 40 }}>
      <p>Wersja: {APP_VERSION}</p>
    </footer>
  );
};

export default Footer;
