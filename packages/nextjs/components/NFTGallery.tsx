import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Token from "./Token";

// import { M3Token } from '~~/types/M3Token';

// const PUCCI_URL = "https://www.timberlinelodge.com/snowcameras/pucci.jpg";

const NFTGallery = () => {
  const [tokens, setTokens] = useState<M3Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<M3Token | null>({} as M3Token);

  const [modalOpen, setModalOpen] = useState(false);

  const handleTokenClick = (token: M3Token) => {
    setSelectedToken(token);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedToken(null);
    setModalOpen(false);
  };

  const getWebcam = async () => {
    return await fetch("/api/pucci-proxy").then(res => res.json());

    // try {
    //   const response = await fetch(PUCCI_URL);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   // Content should be metadata file in JSON format
    //   return response.json();
    // } catch (error) {
    //   console.error(`Error fetching file ${PUCCI_URL}:`, error);
    //   throw error; // Propagate the error for further handling
    // }
  };

  // Fetch all files sequentially
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const allFiles = await getWebcam();
        // Process all files as needed
        console.log(allFiles);
        setTokens(allFiles); // Assuming allFiles contains token data
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchFiles();
  }, []);

  if (!tokens) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {tokens.map((token, index) => (
          <Token key={index} token={token} onClick={() => handleTokenClick(token)} />
        ))}
      </div>
      {modalOpen && <Modal open={modalOpen} selectedToken={selectedToken} onClose={handleModalClose} />}
    </>
  );
};

export default NFTGallery;

// <div class="uk-grid uk-grid-small uk-margin-large-bottom webcam-container" data-uk-grid-margin="">
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-row-first">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras/lodge.jpg?nocache=1709520168" title="Timberline Lodge Camera">
// 					<img src="/snowcameras/lodge.jpg?nocache=1709520168" alt="Live Feed: Timberline Lodge Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">Timberline Lodge <a href="/lodge">BOOK NOW</a></h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras/pucci.jpg?nocache=1709520168" title="Pucci">
// 					<img src="/snowcameras/pucci.jpg?nocache=1709520168" alt="Live Feed: Pucci Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">PUCCI</h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras/FloodEast.jpg?nocache=1709520168" title="Magic Mile">
// 					<img src="/snowcameras/FloodEast.jpg?nocache=1709520168" alt="Live Feed: Magic Mile Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">Magic Mile</h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-grid-margin uk-row-first">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras/FloodSouth.jpg?nocache=1709520168" title="Jeff Flood">
// 					<img src="/snowcameras/FloodSouth.jpg?nocache=1709520168" alt="Live Feed: Jeff Flood Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">Jeff Flood</h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-grid-margin">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras//palmerbottom.jpg?nocache=1709520168" title="Palmer/Silcox Camera">
// 					<img src="snowcameras/palmerbottom.jpg?nocache=1709520168" alt="Live Feed: Palmer/Silcox Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">Palmer</h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-grid-margin">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras//brunotop.jpg?nocache=1709520168" title="Bruno's Camera">
// 					<img src="/snowcameras//brunotop.jpg?nocache=1709520168" alt="Live Feed: Bruno's Lift Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">BRUNO'S LIFT</h5>
// 			</div>
// 				<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-grid-margin uk-row-first">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras//snowstake.jpg?nocache=1709520168" title="Snow Stake Camera">
// 					<img src="/snowcameras//snowstake.jpg?nocache=1709520168" alt="Live Feed: Timberline Snow Stake">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">SNOW STAKE - CLEARED DAILY AT 4PM</h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-grid-margin">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras/summit.jpg?nocache=1709520168" title="Summit Pass Camera">
// 					<img src="/snowcameras/summit.jpg?nocache=1709520168" alt="Live Feed: Summit Pass Camera">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small"><a href="/mountain/summit-pass">SUMMIT PASS</a></h5>
// 			</div>
// 			<div class="uk-margin-large-bottom uk-width-medium-1-3 uk-width-small-1-1 uk-grid-margin">
// 				<div>
// 					<a data-lightbox-type="image" data-uk-lightbox="{group: 'webcam'}" href="/snowcameras//SummitBus.jpg?nocache=1709520168" title="Summit Pass Shuttle">
// 					<img src="/snowcameras//SummitBus.jpg?nocache=1709520168" alt="Live Feed: Summit Pass Shuttle">
// 					</a>
// 				</div>
// 				<h5 class="teaser-headline uk-text-uppercase uk-margin-small">SUMMIT PASS PARKING LOT</h5>
// 			</div>
// 		</div>
