import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API_URL, ENDPOINTS } from "../../api/api_constants";
import { useGetById } from "../../hooks/useBaseEndpointQueries";
import { PiWarning } from "react-icons/pi";
import BallLoader from "../../components/BallLoader";

const TimelineItem = ({
  id,
  title,
  description,
  image_url,
  categories,
  isReversed,
}) => {


  // Definir cuántas categorías mostrar inicialmente
  const categoryLimit = 3;
  const hasManyCatagories = categories && categories.length > categoryLimit;

  return (
    <div
      className={`flex justify-between flex-col md:flex-row mt-6 ${
        isReversed ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Columna 2 - Contenido principal */}
      <div className="w-full md:w-[45%] flex flex-col gap-3 px-4 order-3 md:order-3 lg:order-1 mt-2">
        <h2 className="font-bold text-2xl text-neutral-500">{title}</h2>
        <p className="line-clamp-5 text-justify">{description}</p>

        {/* Contenedor para "Ver nota" y categorías */}
        <div className="flex justify-between space-y-2">
          {/* Botón "Ver nota" */}
          <Link
            to={`/linea-especifica/${id}`}
            className="text-sm text-left cursor-pointer text-blue-500 hover:underline"
          >
            Ver entrada
          </Link>

          {/* Categorías */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Mostrar categorías limitadas o todas */}
            <div className="flex flex-wrap gap-1">
              {categories &&
                categories
                  .slice(
                    0,
                    categoryLimit
                  )
                  .map((category, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      {category.name}
                    </span>
                  ))}

              {/* Botón para mostrar más/menos */}
              {hasManyCatagories && (
                <button
                 
                  className="text-xs px-2 py-1 text-blue-500 hover:underline cursor-pointer"
                >

                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Columna 1 - Imagen */}
      <div className="flex justify-evenly gap-4 items-center w-full md:w-[45%] flex-col md:flex-row order-2 md:order-4 lg:order-3">
        <img
          className="w-full md:w-[380px] h-auto rounded-lg shadow-sm aspect-video"
          src={`${API_URL}/image${image_url}`}
          alt={`Imagen de ${title}`}
        />
      </div>

      {/* Ícono notificación */}
      <div
        className={`flex w-full gap-3 items-center md:flex-col justify-center order-1 md:order-2 lg:order-2 md:w-10 mb-2 ${
          isReversed ? "" : "lg:ml-10"
        }`}
      >
        <img
          src="/imgs/notification.png"
          alt="Notificación"
          className="w-[30px] h-[30px] opacity-30 transition duration-300 cursor-pointer hover:opacity-60"
        />
      </div>

      {/* Línea de tiempo */}
      <div
        className={`relative hidden md:block md:absolute md:left-10 lg:relative md:order-1 lg-order-3 hidden-900 ${
          isReversed ? "lg:mr-17" : "lg:ml-13"
        }`}
      >
        <div className="bg-neutral-200 w-[41px] h-[41px] rounded-full"></div>
        <div className="absolute h-[220px] border-neutral-400 border-l-2 top-[40px] left-[20px]"></div>
      </div>
    </div>
  );
};
TimelineItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.any).isRequired,
  isReversed: PropTypes.bool,
};

const HistoriesTimeline = () => {
  const { year } = useParams();

  const [timelineHistories, setTimelineHistories] = useState([]);

  const {
    data: response,
    isFetching: isFetching,
    error: errorAll,
  } = useGetById(ENDPOINTS.TIMELINE_YEAR, year);

  console.log(timelineHistories);

  useEffect(() => {
    if (response) {
      setTimelineHistories(response.data.histories);
    }
  }, [response]);

  const renderLoading = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full m-auto">
          <BallLoader></BallLoader>

          <p className="text-center text-gray-400 text-xl animate-pulse font-bold">
            Cargando años...
          </p>
        </div>
      </>
    );
  };

  const renderError = () => {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full m-auto">
          <PiWarning className="text-gray-400" size={36}></PiWarning>

          <p className="text-center text-gray-400 text-xl font-bold">
            Surgió un error al cargar, inténtelo nuevamente.
          </p>
        </div>
      </>
    );
  };

  if (errorAll) {
    return renderError();
  }

  if (isFetching) {
    return renderLoading();
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="text-4xl m-2 mt-4 ml-14 text-gray-400">{year}</div>
      <div className="container mx-auto p-4">
        {timelineHistories.map((item, index) => (
          <TimelineItem key={index} {...item} isReversed={index % 2 !== 0} />
        ))}
      </div>
    </div>
  );
};

export default HistoriesTimeline;
