import styled from "styled-components";
import { makeImagePath } from "../Routes/utils";
// import {getMovies, getTvs, IGetMoviesResult} from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { CategoryType, getMovies, getTvshows, IGetNetsResult } from "../Routes/api";


const SliderContain = styled(motion.div)`
    position: relative;
    top: -12rem;
    height: 250px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(5, 1fr);
    position: absolute;
    width: 100%;
    padding: 0 50px;
    padding-bottom: 30px;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
    background-color: white;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    display: flex;
    align-items: center;
    height: 200px;
    width: 100%;
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

const Button = styled.div<{ isRight: boolean }>`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 100px;
  right: ${(props) => (props.isRight ? 0 : null)};
  left: ${(props) => (props.isRight ? null : 0)};
  border-radius: 12px;
  background-color: rgba(100, 100, 100, 0.4);
  cursor: pointer;
  svg {
    fill: white;
    width: 50px;
    height: 50px;
  }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: rgba(0,0,0,0.6);
    opacity: 0;
    width: 100%;
    position: absolute;
    bottom: 0;
    color: white;
    h4 {
        text-align: center;
        font-size: 18px;
    }
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

const Category = styled.div`
    display: block;
    color: white;
    font-size: 18px;
    font-weight: 500;
    padding: 0px 0px 15px 30px;
`;



const rowVar = {
    hidden: (reverse: number) => ({
        x: reverse < 0 ? -window.innerWidth : window.innerWidth,
    }),
    visible: {
        x: 0,
    },
    exit: (reverse: number) => ({
        x: reverse < 0 ? window.innerWidth : -window.innerWidth,
    }),
}

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

const offset = 5;

interface ISliderProps {
    category: CategoryType;
    sortMenu: string;
}

function Sliderfn({ category, sortMenu }: ISliderProps) {
    const history = useHistory()
    const bigMovieMatch = useRouteMatch<{ movieId: string }>(`/${sortMenu}/${category}/:movieId`);
    const { scrollY } = useScroll();
    const { data, isLoading } = useQuery<IGetNetsResult>([sortMenu, category], () => {
        return sortMenu === "movie" ? getMovies(category) : getTvshows(category)
        }
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [reverse, setReverse] = useState(0);
    const toggleLeaving = () => setLeaving(prev => !prev);
    const onBoxClicked = (movieId: number) => {
        history.push(`/${sortMenu}/${category}/${movieId}`);
    }
    const onOverlayClick = () => history.goBack();
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results?.find(movie => movie.id + "" === bigMovieMatch.params.movieId + "")
    const prevIndex = () => {
        if (data) {
            if (leaving) return;
            setReverse(-1);
            toggleLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
    };
    const nextIndex = () => {
        if (data) {
            if (leaving) return;
            setReverse(1);
            toggleLeaving();
            const totalMovies = data.results.length;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    return (
        <>
            {isLoading ? (
                <h1>Loading....</h1>
            ) : (
                <>

                    <SliderContain>
                        <Category>
                            {category.toUpperCase()}
                        </Category>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={reverse}>
                            <Row
                                variants={rowVar}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1.5 }}
                                key={index}
                                custom={reverse}
                            >
                                {data?.results?.slice(offset * index, offset * index + offset).map(movie =>
                                    <Box
                                        layoutId={movie.id + "_" + category}
                                        key={movie.id + "_" + category}
                                        onClick={() => onBoxClicked(movie.id)}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={BoxVar}
                                        transition={{ type: "tween" }}
                                        bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path, "w300")}
                                    >
                                        <Info variants={infoVar}>
                                            <h4>{movie.title || movie.name}</h4>
                                        </Info>
                                    </Box>
                                )}
                            </Row>
                            <Button isRight={false} onClick={prevIndex}>
                                <svg viewBox="0 0 32 32" aria-hidden="true">
                                    <path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z" />
                                </svg>
                            </Button>
                            <Button isRight={true} onClick={nextIndex}>
                                <svg viewBox="0 0 32 32" aria-hidden="true">
                                    <path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z" />
                                </svg>
                            </Button>
                        </AnimatePresence>
                    </SliderContain>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }} />
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId + "_" + category}
                                    style={{ top: scrollY.get() + 100 }}
                                >
                                    {clickedMovie &&
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `url(${makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path, "w500")})`
                                                }} />
                                            <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
                                            <IconGroups>
                                                <BigRate>★ {clickedMovie.vote_average}</BigRate>
                                                {clickedMovie.adult ? (
                                                    <AgeInfo isadult={true}>19</AgeInfo>
                                                ) : (
                                                    <AgeInfo isadult={false}>15</AgeInfo>
                                                )}
                                            </IconGroups>
                                            <BigOverview>{clickedMovie.overview || "Sorry, It doesn't exist"}</BigOverview>
                                        </>}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}

        </>
    );
}

export default Sliderfn;