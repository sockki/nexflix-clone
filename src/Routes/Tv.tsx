import { useQuery } from "react-query";
import styled from "styled-components";
import { CategoryType, getMovies, getTvshows, IGetNetsResult } from "./api";
import { makeImagePath } from "./utils";
import Sliderfn from "../Compoenents/Sliderfn";

const Wrapper = styled.div`
    background: black;
    height: 250px;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 90px;
    background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1) ) , url(${props => props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 10px;
`;

const Overview = styled.p`
    font-size: 24px;
    width: 50%;
`;


function Tv() {
    const {data, isLoading} = useQuery<IGetNetsResult>(
        ["tv", "airing_today"],
        () => getTvshows(CategoryType.airing_today)
      );
    return (
        <Wrapper >{isLoading ? <Loader>Loading....</Loader> :
            <>
                <Banner
                    bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                >
                    <Title>{data?.results[0].title || data?.results[0].name}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                    <Sliderfn sortMenu={"tv"} category={CategoryType.airing_today} />
                    <Sliderfn sortMenu={"tv"} category={CategoryType.on_the_air} />
                    <Sliderfn sortMenu={"tv"} category={CategoryType.popular} />
                    <Sliderfn sortMenu={"tv"} category={CategoryType.top_rated} />
            </>
        }
        </Wrapper>
    );
}

export default Tv;