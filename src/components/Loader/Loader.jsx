import { Puff } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div>
      <Puff
        visible={true}
        height="50"
        width="50"
        color="#87d28d"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass="loader"
      />
    </div>
  );
};

export default Loader;
