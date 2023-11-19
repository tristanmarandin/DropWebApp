import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import { FaImage , FaFileImage , FaRulerCombined, FaSortAmountDownAlt, FaRandom, FaSeedling } from 'react-icons/fa';

import './HomePage.css';

const HomePage = () => {
  const [instruction, setInstruction] = useState('');
  const [imageData, setImageData] = useState([
    { id: 'image1', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
    { id: 'image2', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
    { id: 'image3', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
    { id: 'image4', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
  ]);  
  const [isInstructionButtonClicked, setIsInstructionButtonClicked] = useState(false);
  const [clickedImageId, setClickedImageId] = useState(null);
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);
  const [activeTab, setActiveTab] = useState('Style');
  const [buttonStates, setButtonStates] = useState({
    geometric: false,
    anime: false,
    cartoon: false,
    simple: false,
    complex: false,
    detailed: false,
    colorful: false,
    bw: false,
    logo: false,
    minimalist: false,
    intricatedetails: false,
    highcontrast: false,
    patchdesign: false,
    vectorlineart: false,
    realistic: false,
    myasaki: false,
    steampunk: false,
    disney: false,
    watercolor: false,
    oilpainting: false,
    sculpture: false,
    vaporwave: false,
    digitalart: false,
    conceptart: false,
    pixar: false,
    japanesestyle: false,
    handpoked: false,
    americanoldschool: false,
    vintage: false,
    closeup: false,
    longshot: false,
    landscape: false,
    background: false,
    portrait: false,
    automatic1111: false,
    redream: false,
    arcanediffusion: false,
    wandducstyle: false,
    gta5artworkdiffusion: false,
  });
  const possibleImageDimensions = [
    { value: '1152 x 768', width: '1024', height: '688'},
    { value: '1088 x 896', width: '1024', height: '848'},
    { value: '1024 x 1024', width: '1024', height: '1024'},
    { value: '896 x 1088', width: '848', height: '1024'},
    { value: '768 x 1152', width: '688', height: '1024'}
  ];  
  const [imageDimensions, setImageDimensions] = useState(possibleImageDimensions [2].value); // Default to '1024 x 1024'
  const imageDimensionsSources = [
    '768x1152.jpg',
    '896x1088.jpg',
    '1024x1024.jpg',
    '1088x896.jpg',
    '1152x768.jpg'
  ];
  const [seed, setSeed] = useState('');
  const [generationSteps, setGenerationSteps] = useState('20');
  const [guidanceScale, setGuidanceScale] = useState('7.5');
  const [galleryImages, setGalleryImages] = useState([]);

  // INITIAL ANIMATION
  useEffect(() => {
    let isFirstVisit = !localStorage.getItem("visitedBefore");

    if (isFirstVisit) {
      setTimeout(() => {
        const fullscreenLogo = document.querySelector(".fullscreen-logo");
        fullscreenLogo.style.opacity = "0"; // Start the fade out

        fullscreenLogo.addEventListener("transitionend", () => {
          fullscreenLogo.style.display = "none"; // Hide the logo after fade out
        });
      }, 1000); // Wait for 1 second before starting the fade out

      localStorage.setItem("visitedBefore", "true");
    } else {
      const fullscreenLogo = document.querySelector(".fullscreen-logo");
      fullscreenLogo.style.display = "none"; // If not the first visit, hide the logo immediately
    }
  }, []);
  

  // FUNCTIONS

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  };

  const handleImageClick = async (event, id) => {
    // Check if the user clicked outside of the modal content
    if (event.target.className === 'modal') {
      setClickedImageId(null);
    } else {
      setClickedImageId(id);
  
      // Fetch the clicked image
      const response = await fetch(`http://localhost:4000/api/images/${id}`);
      if (response.ok) {
        const { image } = await response.json();
        // Update the isSubmitButtonClicked state based on the 'community' attribute of the clicked image
        setIsSubmitButtonClicked(image.community);
      } else {
        console.error('Failed to fetch image');
      }
    }
  };

  const handleSuggestToCommunity = async (imageId) => {
    try {
      setIsSubmitButtonClicked(prevState => !prevState);
      const updateResponse = await fetch(`http://localhost:4000/api/images/${imageId}/community`, {
        method: 'PUT',
      });
  
      if (updateResponse.ok) {
        const updatedImage = await updateResponse.json();
        setIsSubmitButtonClicked(updatedImage.image.community);
        console.log('Image community attribute updated successfully');
      } else {
        console.error('Failed to update image community attribute');
      }
    } catch (error) {
      console.error(error);
    }
  }  
  
  const handleDownload = async (src) => {
    // Fetch the image data
    const response = await fetch(src);
    const blob = await response.blob();
  
    // Create an object URL for the image data
    const url = URL.createObjectURL(blob);
  
    // Create a temporary anchor element and click it to start the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.jpg'; // or any other filename you want
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
  };

  const handleButtonToggle = (buttonName, tabName) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [buttonName]: !prevState[buttonName],
    }));
  };

  const getButtonLabelsByTab = (tabName) => {
    const buttonLabels = {
      Style: {
        geometric: 'geometric',
        anime: 'anime',
        cartoon: 'cartoon',
        simple: 'simple',
        complex: 'complex, complicate',
        detailed: 'highly detailed',
        colorful: 'colorful, color',
        bw: 'black and white',
        logo: 'logo',
        minimalist: 'minimalist',
        intricatedetails: 'intricate details',
        highcontrast: 'high contrast',
        patchdesign: 'patch design',
        vectorlineart: 'vector line art',
        realistic: 'realistic',
        myasaki: 'Myasaki',
        steampunk: 'steampunk',
        disney: 'Disney',
        watercolor: 'watercolor',
        oilpainting: 'oilpainting',
        sculpture: 'sculpture',
        vaporwave: 'vaporwave',
        digitalart: 'digital art',
        conceptart: 'concept art',
        pixar: 'Pixar',
        japanesestyle: 'japanese style, oriental style',
        handpoked: 'handpoked, stick and poke',
        americanoldschool: 'american old school tattoo',
        vintage: 'vintage',
      },
      Format: {
        closeup: 'close up',
        longshot: 'longshot',
        landscape: 'landscape',
        background: 'background',
        portrait: 'portrait',
      },
      Model: {
        automatic1111: 'automatic1111',
        redream: 'redream',
        arcanediffusion: 'arcanediffusion',
        wandducstyle: 'wandducstyle',
        gta5artworkdiffusion: 'gta5artworkdiffusion',
      },
    };
  
    return buttonLabels[tabName] || {};
  };

  // Function to handle image width change
  const handleImageDimensionsChange = (event) => {
    const imageDimensionsIndex = event.target.value;
    setImageDimensions(possibleImageDimensions[imageDimensionsIndex].value);
  };

  // Function to handle generation steps change
  const handleGenerationStepsChange = (event) => {
    setGenerationSteps(event.target.value);
  };

  // Function to handle guidance scale change
  const handleGuidanceScaleChange = (event) => {
    setGuidanceScale(event.target.value);
  };

  // Function to handle seed change
  const handleSeedChange = (event) => {
    setSeed(event.target.value);
  };

  const handleSendInstruction = async () => {
    try {
      // Get the instruction from the user input field or textarea
      const instructionTextArea = document.getElementById('instructionInput');
      const instruction = instructionTextArea.value;

      const buttonLabelsByTab = {
        Style: getButtonLabelsByTab('Style'),
        Format: getButtonLabelsByTab('Format'),
        Model: getButtonLabelsByTab('Model'),
      };
  
      // Get the titles of buttons in the ON state
      const selectedButtons = Object.keys(buttonStates).filter(
        buttonName => buttonStates[buttonName]
      );
  
      // Get the parameter values from the state variables
      const seedValue = seed.trim() || null; // Set seed as null if it's an empty string
      const guidanceScaleValue = Number(guidanceScale);

      console.log(Number(possibleImageDimensions.find(dimensions => dimensions.value === imageDimensions).width))
      // Send the instruction to the backend
      const response = await fetch('http://localhost:4000/api/instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction,
          selectedButtons,
          buttonLabelsByTab,
          imageWidth: Number(possibleImageDimensions.find(dimensions => dimensions.value === imageDimensions).width),
          imageHeight: Number(possibleImageDimensions.find(dimensions => dimensions.value === imageDimensions).height),
          seed: seedValue,
          generationSteps: Number.isNaN(generationSteps) ? 20 : generationSteps,
          guidanceScale: Number.isNaN(guidanceScaleValue) ? 7.5 : guidanceScaleValue,
        }),
      })

      // Clear the instruction input field
      instructionTextArea.value = '';

  } catch (error) {
    console.error(error);
  }
  }

  useEffect(() => {
    // Function to update the image source
    const updateImageSource = () => {
      fetch('http://localhost:4000/api/refresh_image')
        .then(response => response.json())
        .then(data => {
          const GeneratedImages = data.images;
  
          // Update the state for the image data
          setImageData(GeneratedImages.map((image, index) => ({
            id: 'image' + (index + 1),
            src: image.imageUrl,
            prompt: image.prompt,
            width: image.width,
            height: image.height,
            generationStep: image.generationStep,
            seed: image.seed,
            guidanceScale: image.guidanceScale
          })));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
  
    // Refresh the image source every five seconds
    const intervalId = setInterval(updateImageSource, 5000);
  
    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render
  

  useEffect(() => {
    // Function to update the gallery
    const fetchImages = async () => {
      try {
        // Fetch the images with community = true from the backend API
        const response = await fetch('http://localhost:4000/api/images?user=true');
        const data = await response.json();

        // Update the images state with the fetched images
        setGalleryImages(data.images);
      } catch (error) {
        console.error(error);
      }
    };

    // Refresh the image source every five seconds
    const intervalUser = setInterval(fetchImages, 5000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalUser);
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  // Function to chunk an array into smaller arrays of a specified size
  function chunkArray(array, size) {
    const chunked = [];
    let index = 0;
    while (index < array.length) {
      chunked.push(array.slice(index, size + index));
      index += size;
    }
    return chunked;
  }

  // Chunk the gallery images into groups of four
  const chunkedGalleryImages = chunkArray(galleryImages, 4);

  return (
    <div className="body-container">
      <div className="fullscreen-logo">
        <img src="Drop.jpg" alt="Logo" />
      </div>
      <div className="homepage-container">
        <div className="head-menu-container">
          <div className="head-container">
            <div className="logo-title-container">
              <div className="logo">
                <img src="Drop.jpg" alt="Logo" className="logo-image" />
              </div>
              <div className="head-title">DROP</div>
            </div>
          </div>
          <ul className="menu">
            <li className='activeLink'>
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="separator">|</li>
            <li>
              <NavLink to="/community">Community</NavLink>
            </li>
          </ul>
        </div>
        <div className="intro">Saisissez votre imaginaire</div>
        <div className="instruction-area">
          <input 
            type="text" 
            id="instructionInput"
            className="instruction-input" 
            placeholder="Enter instruction here..." 
            value={instruction}
            onChange={handleInstructionChange}  
          />
          <button onClick={() => { handleSendInstruction(); setIsInstructionButtonClicked(true); }} className="send-instruction-button">
            <i className="arrow right"></i>
          </button>
        </div>
  
        {isInstructionButtonClicked && 
          <div className="generatedImage-wrapper">
            {imageData.map(({ id, src, prompt, width, height, generationStep, seed, guidanceScale }) => (
              <div className="generatedImage" onClick={(event) => handleImageClick(event, id)} key={id}>
                <img
                  id={id}
                  src={src}
                  alt={id}
                  className="imageStyle"
                />
                {clickedImageId === id && 
                  <div className="modal" onClick={(event) => handleImageClick(event, id)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-text">
                        <div className="modal-prompt">
                          <p>{prompt}</p>
                        </div>
                        <div className="modal-parameters">
                          <p>Width<br/><span>{width}</span></p>
                          <p>Height<br/><span>{height}</span></p>
                          <p>Generation Step<br/><span>{generationStep}</span></p>
                          <p>Seed<br/><span>{seed}</span></p>
                          <p>Guidance Scale<br/><span>{guidanceScale}</span></p>
                        </div>
                        <button 
                          onClick={() => handleSuggestToCommunity(id)} 
                          className={`submit-button ${isSubmitButtonClicked ? 'clicked' : ''}`}
                        >
                          {isSubmitButtonClicked ? <FaLock /> : <FaLockOpen />}
                          <span>Keep Private</span>
                        </button>
                      </div>
                      <div className="modal-image">
                        <img
                          id={id}
                          src={src}
                          alt={id}
                          className="imageStyle"
                        />
                        <button onClick={() => handleDownload(src)} className="download-button">
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
        }

        {/* Tablist */}
        <ul className="tablist">
          <li
            className={activeTab === 'Style' ? 'active' : ''}
            onClick={() => handleTabSelect('Style')}
          >
            Style
          </li>
          <li
            className={activeTab === 'Format' ? 'active' : ''}
            onClick={() => handleTabSelect('Format')}
          >
            Format
          </li>
          <li
            className={activeTab === 'Modèle' ? 'active' : ''}
            onClick={() => handleTabSelect('Modèle')}
          >
            Modèle
          </li>
          <li
            className={activeTab === 'Paramètres' ? 'active' : ''}
            onClick={() => handleTabSelect('Paramètres')}
          >
            Paramètres
          </li>
        </ul>

        <div className="tab-content" id="styleTab" style={{ display: activeTab === 'Style' ? 'block' : 'none' }}>
          <div className="style-tab">
              <div className="style-section">
                <h2 className="section-title">Basic Styles</h2>
                <div className="style-buttons"> {/* Add this wrapper */}
                  <div 
                    className={`style-button ${buttonStates.geometric ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('geometric', 'style')}
                  >
                    <div className="button-image">
                      <img src="geometric.jpg" alt="Geometric" />
                    </div>
                    <h3>Geometric</h3>
                    <p>Explore the beauty of geometric patterns and shapes.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.anime ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('anime', 'style')}
                  >
                    <div className="button-image">
                      <img src="anime.jpg" alt="Anime" />
                    </div>
                    <h3>Anime</h3>
                    <p>Bring your artwork to life with vibrant anime-inspired styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.cartoon ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('cartoon', 'style')}
                  >
                    <div className="button-image">
                      <img src="cartoon.jpg" alt="Cartoon" />
                    </div>
                    <h3>Cartoon</h3>
                    <p>Add a touch of fun and humor with playful cartoon styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.simple ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('simple', 'style')}
                  >
                    <div className="button-image">
                      <img src="simple.jpg" alt="Simple" />
                    </div>
                    <h3>Simple</h3>
                    <p>Embrace minimalism and let simplicity speak in your art.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.complex ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('complex', 'style')}
                  >
                    <div className="button-image">
                      <img src="complex.jpg" alt="Complex" />
                    </div>
                    <h3>Complex</h3>
                    <p>Challenge yourself with intricate and complex artistic styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.detailed ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('detailed', 'style')}
                  >
                    <div className="button-image">
                      <img src="detailed.jpg" alt="Detailed" />
                    </div>
                    <h3>Detailed</h3>
                    <p>Capture every fine detail with highly detailed art styles.</p>
                  </div>            
                  <div 
                    className={`style-button ${buttonStates.colorful ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('colorful', 'style')}
                  >
                    <div className="button-image">
                      <img src="colorful.jpg" alt="Colorful" />
                    </div>
                    <h3>Colorful</h3>
                    <p>Express your creativity with vibrant and colorful art styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.bw ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('bw', 'style')}
                  >
                    <div className="button-image">
                      <img src="bw.jpg" alt="B&W" />
                    </div>
                    <h3>B&W</h3>
                    <p>Experiment with black and white aesthetics for a classic touch.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.logo ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('logo', 'style')}
                  >
                    <div className="button-image">
                      <img src="logo.jpg" alt="Logo" />
                    </div>
                    <h3>Logo</h3>
                    <p>Create captivating logo designs with unique artistic styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.minimalist ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('minimalist', 'style')}
                  >
                    <div className="button-image">
                      <img src="minimalist.jpg" alt="Minimalist" />
                    </div>
                    <h3>Minimalist</h3>
                    <p>Embrace simplicity and elegance with minimalist art styles.</p>          
                  </div>
                  <div 
                    className={`style-button ${buttonStates.intricatedetails ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('intricatedetails', 'style')}
                  >
                    <div className="button-image">
                      <img src="intricatedetails.jpg" alt="Intricated Details" />
                    </div>
                    <h3>Intricated Details</h3>
                    <p>Add intricate and detailed elements to your artwork for a captivating effect.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.highcontrast ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('highcontrast', 'style')}
                  >
                    <div className="button-image">
                      <img src="highcontrast.jpg" alt="High Contrast" />
                    </div>
                    <h3>High Contrast</h3>
                    <p>Create bold and striking compositions with high contrast styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.patchdesign ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('patchdesign', 'style')}
                  >
                    <div className="button-image">
                      <img src="patchdesign.jpg" alt="Patch Design" />
                    </div>
                    <h3>Patch Design</h3>
                    <p>Design unique patches with custom artwork and vibrant colors.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.vectorlineart ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('vectorlineart', 'style')}
                  >
                    <div className="button-image">
                      <img src="vectorlineart.jpg" alt="Vector Line Art" />
                    </div>
                    <h3>Vector Line Art</h3>
                    <p>Explore clean and precise line work with vector-based art styles.</p>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.realistic ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('realistic', 'style')}
                  >
                    <div className="button-image">
                      <img src="realistic.jpg" alt="Realistic" />
                    </div>
                    <h3>Realistic</h3>
                    <p>Achieve lifelike representations and detailed realism in your artwork.</p>
                  </div>
                </div>
              </div>

              <div className="style-section">
                <h2 className="section-title">Advanced Styles</h2>
                <div className="style-buttons"> {/* wrapper */}
                  <div 
                    className={`style-button ${buttonStates.myasaki ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('myasaki', 'style')}
                  >
                    <div className="button-image">
                      <img src="myasaki.jpg" alt="Myasaki" />
                    </div>
                    <h3>Myasaki</h3>
                    <p>Pay tribute to the imaginative and whimsical world of Myasaki.</p>
                    <NavLink to="/myasaki-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.steampunk ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('steampunk', 'style')}
                    >
                    <div className="button-image">
                      <img src="steampunk.jpg" alt="Steampunk" />
                    </div>
                    <h3>Steampunk</h3>
                    <p>Combine Victorian aesthetics with futuristic steam-powered technology.</p>
                    <NavLink to="/steampunk-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.disney ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('disney', 'style')}
                    >
                    <div className="button-image">
                      <img src="disney.jpg" alt="Disney" />
                      </div>
                    <h3>Disney</h3>
                    <p>Bring the magic of Disney to your artwork with enchanting styles.</p>
                    <NavLink to="/disney-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.watercolor ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('watercolor', 'style')}
                    >
                    <div className="button-image">
                      <img src="watercolor.jpg" alt="Watercolor" />
                    </div>
                    <h3>Watercolor</h3>
                    <p>Immerse your art in the fluid beauty of watercolor painting.</p>
                    <NavLink to="/watercolor-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.oilpainting ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('oilpainting', 'style')}
                    >
                    <div className="button-image">
                      <img src="oilpainting.jpg" alt="OilPainting" />
                    </div>
                    <h3>Oil Painting</h3>
                    <p>Emulate the rich textures and colors of traditional oil paintings.</p>
                    <NavLink to="/oilpainting-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.sculpture ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('sculpture', 'style')}
                    >
                    <div className="button-image">
                      <img src="sculpture.jpg" alt="Sculpture" />
                    </div>
                    <h3>Sculpture</h3>
                    <p>Explore the three-dimensional artistry of sculptural styles.</p>
                    <NavLink to="/sculpture-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.vaporwave ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('vaporwave', 'style')}
                    >
                    <div className="button-image">
                      <img src="vaporwave.jpg" alt="VaporWave" />
                    </div>
                    <h3>VaporWave</h3>
                    <p>Take inspiration from the retro-futuristic aesthetics of VaporWave.</p>
                    <NavLink to="/vaporwave-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.digitalart ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('digitalart', 'style')}
                    >
                    <div className="button-image">
                      <img src="digitalart.jpg" alt="Digital Art" />
                    </div>
                    <h3>Digital Art</h3>
                    <p>Discover the endless possibilities of digital art styles.</p>
                    <NavLink to="/digitalart-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.conceptart ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('conceptart', 'style')}
                    >
                    <div className="button-image">
                      <img src="conceptart.jpg" alt="Concept Art" />
                    </div>
                    <h3>Concept Art</h3>
                    <p>Bring your imaginative ideas to life with concept art styles.</p>
                    <NavLink to="/conceptart-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.pixar ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('pixar', 'style')}
                    >
                    <div className="button-image">
                      <img src="pixar.jpg" alt="Pixar" />
                    </div>
                    <h3>Pixar</h3>
                    <p>Capture the charm and storytelling magic of Pixar animation.</p>
                    <NavLink to="/pixar-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.japanesestyle ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('japanesestyle', 'oriental style')}
                    >
                    <div className="button-image">
                      <img src="japanesestyle.jpg" alt="Japanese Style" />
                    </div>
                    <h3>Japanese Style</h3>
                    <p>Embrace the beauty and elegance of traditional Japanese art.</p>
                    <NavLink to="/japanese-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.handpoked ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('handpoked', 'style')}
                    >
                    <div className="button-image">
                      <img src="handpoked.jpg" alt="Hand Poked" />
                    </div>
                    <h3>Hand Poked</h3>
                    <p>Create unique and intricate art with hand-poked tattoo styles.</p>
                    <NavLink to="/handpoked-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.americanoldschool ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('americanoldschool', 'style')}
                    >
                    <div className="button-image">
                      <img src="americanoldschool.jpg" alt="American Old School" />
                    </div>
                    <h3>American Old School</h3>
                    <p>Celebrate the nostalgia of American traditional tattoo styles.</p>
                    <NavLink to="/americanoldstyle-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.vintage ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('vintage', 'style')}
                    >
                    <div className="button-image">
                      <img src="vintage.jpg" alt="Vintage" />
                    </div>
                    <h3>Vintage</h3>
                    <p>Transport your art to the past with vintage-inspired styles.</p>
                    <NavLink to="/vintage-style-collection">
                      <img src="explore.jpg" alt="explore" className="explore-button" />
                    </NavLink>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <div className="tab-content" id="formatTab" style={{ display: activeTab === 'Format' ? 'block' : 'none' }}>
          <div className="format-buttons"> {/* Add this wrapper */}
            <div 
              className={`format-button ${buttonStates.closeup ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('closeup', 'style')}
              >
              <div className="button-image">
                <img src="closeup.jpg" alt="Close Up" />
              </div>
              <h3>Close Up</h3>
              <p>Focus on capturing intricate details with close-up shots.</p>
            </div>
            <div 
              className={`format-button ${buttonStates.longshot ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('longshot', 'style')}
              >
              <div className="button-image">
                <img src="longshot.jpg" alt="Long Shot" />
              </div>
              <h3>Long Shot</h3>
              <p>Emphasize the subject's surroundings and context with long shots.</p>
            </div>
            <div 
              className={`format-button ${buttonStates.landscape ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('landscape', 'style')}
              >
              <div className="button-image">
                <img src="landscape.jpg" alt="Landscape" />
              </div>
              <h3>Landscape</h3>
              <p>Capture the beauty and vastness of natural landscapes.</p>
            </div>
            <div 
              className={`format-button ${buttonStates.background ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('background', 'style')}
              >
              <div className="button-image">
                <img src="background.jpg" alt="Background" />
              </div>
              <h3>Background</h3>
              <p>Enhance your artwork by focusing on background elements and scenery.</p>
            </div>
            <div 
              className={`format-button ${buttonStates.portrait ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('portrait', 'style')}
              >
              <div className="button-image">
                <img src="portrait.jpg" alt="Portrait" />
              </div>
              <h3>Portrait</h3>
              <p>Create compelling character portraits with distinct personalities.</p>
            </div>
          </div>
        </div>

        <div className="tab-content" id="modeleTab" style={{ display: activeTab === 'Modèle' ? 'block' : 'none' }}>
          <div className="model-buttons"> {/* Add this wrapper */}
            <div 
              className={`model-button ${buttonStates.automatic1111 ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('automatic1111', 'style')}
              >
              <div className="button-image">
                <img src="automatic1111.jpg" alt="Automatic 11.11" />
              </div>
              <h3>Automatic 11.11</h3>
              <p>Discover the magic of automatic generation with AI-powered 11.11 models.</p>
            </div>
            <div 
              className={`model-button ${buttonStates.redream ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('redream', 'style')}
              >
              <div className="button-image">
                <img src="redream.jpg" alt="Redream" />
              </div>
              <h3>Redream</h3>
              <p>Bring your wildest dreams to life with the enchanting Redream model.</p>
            </div>
          <div 
              className={`model-button ${buttonStates.arcanediffusion ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('arcanediffusion', 'style')}
              >
              <div className="button-image">
                <img src="arcanediffusion.jpg" alt="Arcane Diffusion" />
              </div>
              <h3>Arcane Diffusion</h3>
              <p>Unleash the mystical and arcane with the powerful Diffusion model.</p>
            </div>
          <div 
              className={`model-button ${buttonStates.wandducstyle ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('wandducstyle', 'style')}
              >
              <div className="button-image">
                <img src="wandducstyle.jpg" alt="Wand-Ducstyle" />
              </div>
              <h3>Wand-Ducstyle</h3>
              <p>Experience the unique style of Wand-Ducstyle for truly mesmerizing creations.</p>
            </div>
            <div 
              className={`model-button ${buttonStates.gta5artworkdiffusion ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('gta5artworkdiffusion', 'style')}
              >
              <div className="button-image">
                <img src="gta5artworkdiffusion.jpg" alt="GTA5 Artwork Diffusion" />
              </div>
              <h3>GTA5 Artwork Diffusion</h3>
              <p>Blend the worlds of GTA5 and artwork with the Artwork Diffusion model.</p>
            </div>
          </div>
        </div>

        <div className="tab-content" id="parametresTab" style={{ display: activeTab === 'Paramètres' ? 'block' : 'none' }}>
          <div className="parametres">
            <div className="dimension-parametre">
              <label htmlFor="dimension">
                <FaRulerCombined size={20} style={{ marginRight: '10px' }} />
                Dimensions
              </label>
              <div className="dimension-icons">
                <FaImage size={20} />
                <input
                  key={imageDimensions}
                  type="range"
                  id="dimension"
                  min="0"
                  max="4"
                  step="1"
                  value={possibleImageDimensions.findIndex(({ value }) => value === imageDimensions)}
                  onChange={handleImageDimensionsChange}
                />
                <FaFileImage size={20} />
              </div>
              <p>{imageDimensions}</p>
              <div className="dimension-image">
                <img src={`/${imageDimensionsSources[possibleImageDimensions.findIndex(dimensions => dimensions.value === imageDimensions)]}`} alt="Dimension Preview" />
              </div>
            </div>
            <div className="other-parametres">
                <div className="parametre">
                  <div className="parametre-title">
                    <label htmlFor="generationSteps">
                      <FaSortAmountDownAlt  size={20} style={{ marginRight: '10px' }} />
                      Generation Steps
                    </label>
                    <input
                      type="number"
                      id="generationStepsValue"
                      value={generationSteps}
                      onChange={handleGenerationStepsChange}
                      className="parametre-input"
                    />
                  </div>
                  <input
                    type="range"
                    id="generationSteps"
                    min="1"
                    max="50"
                    step="1"
                    value={generationSteps}
                    onChange={handleGenerationStepsChange}
                  />
                </div>
                <div className="parametre">
                  <div className="parametre-title">
                    <label htmlFor="guidanceScale">
                      <FaRandom  size={20} style={{ marginRight: '10px' }} />
                      Guidance Scale
                    </label>
                    <input
                      type="number"
                      id="guidanceScaleValue"
                      step="0.5"
                      value={guidanceScale}
                      onChange={handleGuidanceScaleChange}
                      className="parametre-input"
                    />
                  </div>
                  <input
                    type="range"
                    id="guidanceScale"
                    min="0"
                    max="10"
                    step="0.5"
                    value={guidanceScale}
                    onChange={handleGuidanceScaleChange}
                  />
                </div>
                <div className="parametre">
                  <div className="parametre-title">
                    <label htmlFor="seed">
                      <FaSeedling  size={20} style={{ marginRight: '10px' }} />
                      Seed
                    </label>
                    <input
                      type="text"
                      id="seed"
                      value={seed}
                      onChange={handleSeedChange}
                      placeholder="1aB2cD3eF4gH5iJ6kL7mN8oP9qR"
                      className="parametre-seed-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> 
          
          <div className="gallery">
            {chunkedGalleryImages.map((imageChunk, chunkIndex) => (
              <div key={chunkIndex}>
                <div className="imageRow">
                  {imageChunk.map((image) => (
                    <div className="galleryImages" onClick={(event) => handleImageClick(event, image._id)} key={image._id}>
                      <img
                        key={image._id}
                        src={image.imageUrl}
                        alt={image.prompt}
                        className={"galleryImage"}
                        loading="lazy" // Enable lazy loading for the image
                        onClick={(event) => handleImageClick(event, image._id)}
                      />
                      
                      {clickedImageId === image._id && 
                        <div className="modal" onClick={(event) => handleImageClick(event, image._id)}>
                          <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-text">
                              <div className="modal-prompt">
                                <p>{image.prompt}</p>
                              </div>
                              <div className="modal-parameters">
                                <p>Width<br/><span>{image.width}</span></p>
                                <p>Height<br/><span>{image.height}</span></p>
                                <p>Generation Step<br/><span>{image.generationStep}</span></p>
                                <p>Seed<br/><span>{image.seed}</span></p>
                                <p>Guidance Scale<br/><span>{image.guidanceScale}</span></p>
                              </div>
                              <button 
                                onClick={() => handleSuggestToCommunity(image._id)} 
                                className={`submit-button ${isSubmitButtonClicked ? 'clicked' : ''}`}
                              >
                                {isSubmitButtonClicked ? <FaLock /> : <FaLockOpen />}
                                <span>Keep Private</span>
                              </button>
                            </div>
                            <div className="modal-image">
                              <img
                                id={image._id}
                                src={image.imageUrl}
                                alt={image._id}
                                className="galleryImage"
                              />
                              <button onClick={() => handleDownload(image.imageUrl)} className="download-button">
                                <FaDownload />
                              </button>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  ))}
                </div>
                <div className="imagePrompt">{imageChunk[0].prompt}</div>
              </div>
            ))}
          </div>  
      </div>
    </div>
  );
};

export default HomePage;