import logo from '../assets/logo.png';

function AuthHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <img
        src={logo}
        alt="TrainingApp"
        style={{ width: '150px', height: 'auto', display: 'block', margin: '0 auto' }}
      />
      <p style={{ fontSize: '0.85rem', color: '#888', margin: '-0rem 0 0' }}>
        Cada serie cuenta. Sin excusas.
      </p>
    </div>
  );
}

export default AuthHeader;