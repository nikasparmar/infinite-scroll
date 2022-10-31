import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

function App() {

  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get(`https://englishapi.xynie.com/app-api/v1/photo-gallery-feed-page/page/${page}`);
      const responseCopy = [...data,...response?.data?.nodes];
      setData(responseCopy)
    }
    fetchItems()
  }, [page]);


  useEffect(() => {
    const handleScroll = (e) => {
      setIsFetching(true);
      const scrollHeight = e.target.documentElement.scrollHeight;
      const currentHeight = e.target.documentElement.scrollTop + window.innerHeight;
      if (currentHeight + 1 > scrollHeight) {
        setIsFetching(false);
        setPage(page + 1);
      };
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page])

  return (
    <div className='w-full min-h-screen p-4 lg:p-20 flex justify-center' >
      <div className='layout'>
        {
          data?.map((ele) => (
            <div key={ele?.node?.nid} className="rounded-md flex flex-col lg:flex-row w-full my-5 shadow-default"  >
              <div className='h-40 w-full lg:w-40'>
                <img src={ele?.node?.ImageStyle_thumbnail}
                  loading="lazy"
                  className="object-fit object-cover h-full w-full rounded-tr-md lg:rounded-tr-none rounded-tl-md lg:rounded-bl-md" />
              </div>
              <div className='p-3 lg:p-5 flex flex-col justify-between w-full'>
                <div className='text-xl'>{ele?.node?.title}</div>
                <div className='italic text-base'>Author: {ele?.node?.author_name}</div>
                <div className='flex justify-between w-full'>
                  <div className='text-sm md:text-base flex flex-col md:flex-row items-start'>
                    <div>
                      Total views
                    </div>
                    <div className='ml-0 md:ml-1'>
                      {ele?.node?.views_count}
                    </div>
                  </div>
                  <div className='text-sm md:text-base flex items-center flex-col md:flex-row'>
                    <div className=''>
                      Last updated
                    </div>
                    <div className='ml-0 md:ml-1'>
                      {moment(ele?.node?.last_update).format('DD-MM-YYYY')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
        {isFetching && <p className='text-2xl my-10'>Loading...</p>}
      </div>
    </div>
  );
}

export default App;
