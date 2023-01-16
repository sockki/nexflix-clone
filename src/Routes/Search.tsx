import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../Routes/utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getSerchMovies, getSerchTvshows, IGetNetsResult } from "./api";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
    padding: 100px;
    padding-top: 50px;
    background: black;
    height: 100vh;
`;

const Title = styled.div`
    font-size: 40px;
    margin: 40px 0;
`;

const Row = styled.div`
    width: 100%;
    display: grid;
    padding-bottom: 50px;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    row-gap: 25px;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 200px;
    font-size: 20px;
    border-radius: 10px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: rgba(0,0,0,0.6);
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    color: white;
`;

const MenuTitle = styled.h1`
  font-size: 24px;
  font-weight: 300;
  padding: 15px 0;
`;

const Overlay = styled(motion.div)`
    position: fixed;
    z-index: 9999;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 40vw;
    border-radius: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    overflow: hidden;
    z-index: 99999;
`;

const BigCover = styled.div`
    z-index: 99999;
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
    border-radius: 20px;
`;

const BigTitle = styled.h3`
    display: flex;
    color: ${props => props.theme.white.lighter};
    padding: 10px;
    font-size: 28px;
    z-index: 9999;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    color: ${props => props.theme.white.lighter};
    z-index: 9999;
`;

const BigRate = styled.div`
    display: flex;
    gap: 6px;
    width: 80px;
    height: 30px;
    border: solid 1px #fed049;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    color: #fed049;
`;

const AgeInfo = styled.div<{ isadult: boolean }>`
  width: 42px;
  height: 42px;
  background-color: ${(props) => (props.isadult ? props.theme.red : "#019267")};
  font-size: 25px;
  font-weight: 600;
  text-align: center;
  border-radius: 12px;
  line-height: 40px;
`;

const IconGroups = styled.div`
    width: 150px;
    height: 50px;
    /* margin: 200px 0 0 10px; */
    position: relative;
    left: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;


const BoxVar = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: 10,
        transition: {
            delay: 0.3,
            type: "tween"
        }
    },
}

const infoVar = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.3,
            type: "tween"
        }
    }
}


function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const useMultipleQuery = () => {
        const searchmoive = useQuery<IGetNetsResult>(["movie", keyword], () => getSerchMovies(String(keyword)));
        const searchtvshow = useQuery<IGetNetsResult>(["tv", keyword], () => getSerchTvshows(String(keyword)));
        return [searchmoive, searchtvshow];
    }
    const [
        { isLoading: loadingSearchMovie, data: SearchMoviedata },
        { isLoading: loadingSearchtv, data: SearchTvdata },
    ] = useMultipleQuery();
    const [isplat, setIsplat] = useState(false);
    const bigMovieMatch = useRouteMatch<{ movieId: string }>(`/search/:movieId`);
    const history = useHistory()
    const { scrollY } = useScroll();
    const onMovieBoxClicked = (movieId: number) => {
        history.push(`/search/${movieId}?keyword=${keyword}`);
        setIsplat(true);
    }
    const onTvBoxClicked = (movieId: number) => {
        history.push(`/search/${movieId}?keyword=${keyword}`);
        setIsplat(false);
    }
    const onOverlayClick = () => history.goBack();
    const clickedMovieOrTv = bigMovieMatch?.params.movieId && (isplat ?
        SearchMoviedata?.results?.find(movie => movie.id + "" === bigMovieMatch.params.movieId + "") :
        SearchTvdata?.results?.find(movie => movie.id + "" === bigMovieMatch.params.movieId + "")
    )
    return (
        <><Wrapper>
            <Title>
                <span style={{ fontSize: "30px" }}>Search result for </span><span>"{keyword}"</span>
            </Title>
            {loadingSearchMovie || loadingSearchtv ? <h1>loading</h1> : (
                <>

                    <MenuTitle>Movie result</MenuTitle>
                    <Row>
                        {SearchMoviedata?.results.slice(0, 12).map(movie => (movie.backdrop_path && movie.poster_path ? (
                            <Box
                            layoutId={movie.id + ""}
                            key={movie.id}
                            onClick={() => onMovieBoxClicked(movie.id)}
                            whileHover="hover"
                            initial="normal"
                            variants={BoxVar}
                            transition={{ type: "tween" }}
                            bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w300")}
                        >
                            <Info variants={infoVar}>
                                <h1>{movie.title || movie.name}</h1>
                            </Info>
                        </Box>
                        ) : null))}
                    </Row>
                    <MenuTitle>tv show result</MenuTitle>
                    <Row>
                        {SearchTvdata?.results.slice(0, 12).map(tv => (tv.backdrop_path && tv.poster_path ? (
                            <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            onClick={() => onTvBoxClicked(tv.id)}
                            whileHover="hover"
                            initial="normal"
                            variants={BoxVar}
                            transition={{ type: "tween" }}
                            bgPhoto={makeImagePath(tv.backdrop_path || tv.poster_path, "w300")}
                        >
                            <Info variants={infoVar}>
                                <h1>{tv.title || tv.name}</h1>
                            </Info>
                        </Box>
                        ) : null))}
                    </Row>

                </>
            )}
        </Wrapper>
            <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }} />
                        <BigMovie
                            layoutId={bigMovieMatch.params.movieId}
                            style={{ top: scrollY.get() + 100 }}
                        >
                            {clickedMovieOrTv &&
                                <>
                                    <BigCover
                                        style={{
                                            backgroundImage: `url(${makeImagePath(clickedMovieOrTv.backdrop_path || clickedMovieOrTv.poster_path, "w500")})`
                                        }} />
                                    <BigTitle>{clickedMovieOrTv.title || clickedMovieOrTv.name}</BigTitle>
                                    <IconGroups>
                                        <BigRate>★ {clickedMovieOrTv.vote_average}</BigRate>
                                        {clickedMovieOrTv.adult ? (
                                            <AgeInfo isadult={true}>19</AgeInfo>
                                        ) : (
                                            <AgeInfo isadult={false}>15</AgeInfo>
                                        )}
                                    </IconGroups>
                                    <BigOverview>{clickedMovieOrTv.overview || "Sorry, It doesn't exist"}</BigOverview>
                                </>
                            }
                        </BigMovie>
                    </>
                ) : null}
            </AnimatePresence>
        </>

    );
}

export default Search;