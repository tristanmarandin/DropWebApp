import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  let GeneratedImageId;
  const [images, setImages] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [instruction, setInstruction] = useState('');
  const [activeTab, setActiveTab] = useState('Style');
  const [imageWidth, setImageWidth] = useState('512');
  const [imageHeight, setImageHeight] = useState('512');
  const [seed, setSeed] = useState('');
  const [generationSteps, setGenerationSteps] = useState('20');
  const [guidanceScale, setGuidanceScale] = useState('7.5');
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

  const handleTabSelect = (tabName) => {
    setActiveTab(tabName);
  };

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
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
  const handleImageWidthChange = (event) => {
    setImageWidth(event.target.value);
  };

  // Function to handle image height change
  const handleImageHeightChange = (event) => {
    setImageHeight(event.target.value);
  };

  // Function to handle seed change
  const handleSeedChange = (event) => {
    setSeed(event.target.value);
  };

  // Function to handle generation steps change
  const handleGenerationStepsChange = (event) => {
    setGenerationSteps(event.target.value);
  };

  // Function to handle guidance scale change
  const handleGuidanceScaleChange = (event) => {
    setGuidanceScale(event.target.value);
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
          imageWidth: Number.isNaN(imageWidth) ? 512 : imageWidth,
          imageHeight: Number.isNaN(imageHeight) ? 512 : imageHeight,
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

  const handleSuggestToCommunity = async () => {
    try {
      const updateResponse = await fetch(`http://localhost:4000/api/images/${GeneratedImageId}/community`, {
      method: 'PUT',
      });
  
      if (updateResponse.ok) {
        console.log('Image community attribute updated successfully');
      } else {
        console.error('Failed to update image community attribute');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const imageElement = document.getElementById('Elephant');

    // Function to update the image source
    const updateImageSource = () => {
      fetch('http://localhost:4000/api/refresh_image')
        .then(response => response.json())
        .then(data => {
          const GeneratedImage = data.image;
          GeneratedImageId = GeneratedImage._id;
          imageElement.src = GeneratedImage.imageUrl;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    // Refresh the image source every five seconds
    const intervalId = setInterval(updateImageSource, 500);

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch the images with community = true from the backend API
        const response = await fetch('http://localhost:4000/api/images?user=true');
        const data = await response.json();

        // Update the images state with the fetched images
        setImages(data.images);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <div className="header">Drop</div>
      <div className="logo">
        <img src="Drop.jpg" alt="Logo" width="50" />
      </div>
      <ul className="menu">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/community">Community</NavLink>
        </li>
        <li>
          <NavLink to="/styleCollection">Style Collection</NavLink>
        </li>
        <li>
          <NavLink to="/support">Support</NavLink>
        </li>
      </ul>
      <div className="header">Vous êtes l'artiste, je suis votre pinceau.</div>
      <div className="header">Saisissez votre imaginaire</div>
      <div className="instruction-area">
        <input 
          type="text" 
          id="instructionInput"
          className="instruction-input" 
          placeholder="Enter instruction here..." 
          value={instruction}
          on Change={handleInstructionChange}  
        />
        <button onClick={handleSendInstruction} className="send-instruction-button">
          <i className="arrow right"></i>
        </button>
      </div>
      <textarea
        id="instructionInput"
        rows="4"
        cols="50"
        value={instruction}
        onChange={handleInstructionChange}
      ></textarea>
      <button onClick={handleSendInstruction}>Send Instruction</button>
      <div className="generatedImage">
      <img
        id="Elephant"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg"
        alt="Elephant Image"
      />
      </div>
      <div className="community button">
        <button onClick={handleSuggestToCommunity}>Suggest to the community</button>
      </div>
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
              <div className="style-button">
                <img src="geometric.jpg" alt="Geometric" />
                <h3>Geometric</h3>
                <p>Explore the beauty of geometric patterns and shapes.</p>
                <button
                  className={buttonStates.geometric ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('geometric', 'style')}
                >
                  {buttonStates.geometric ? 'ON' : 'OFF'}
                </button> 
              </div>
              <div className="style-button">
                <img src="anime.jpg" alt="Anime" />
                <h3>Anime</h3>
                <p>Bring your artwork to life with vibrant anime-inspired styles.</p>
                <button
                  className={buttonStates.anime ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('anime', 'style')}
                >
                  {buttonStates.anime ? 'ON' : 'OFF'}
                </button> 
              </div>
              <div className="style-button">
                <img src="cartoon.jpg" alt="Cartoon" />
                <h3>Cartoon</h3>
                <p>Add a touch of fun and humor with playful cartoon styles.</p>
                <button
                  className={buttonStates.cartoon ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('cartoon', 'style')}
                >
                  {buttonStates.cartoon ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="simple.jpg" alt="Simple" />
                <h3>Simple</h3>
                <p>Embrace minimalism and let simplicity speak in your art.</p>
                <button
                  className={buttonStates.simple ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('simple', 'style')}
                >
                  {buttonStates.simple ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="complex.jpg" alt="Complex" />
                <h3>Complex</h3>
                <p>Challenge yourself with intricate and complex artistic styles.</p>
                <button
                  className={buttonStates.complex ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('complex', 'style')}
                >
                  {buttonStates.complex ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="detailed.jpg" alt="Detailed" />
                <h3>Detailed</h3>
                <p>Capture every fine detail with highly detailed art styles.</p>
                <button
                  className={buttonStates.detailed ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('detailed', 'style')}
                >
                  {buttonStates.detailed ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="colorful.jpg" alt="Colorful" />
                <h3>Colorful</h3>
                <p>Express your creativity with vibrant and colorful art styles.</p>
                <button
                  className={buttonStates.colorful ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('colorful', 'style')}
                >
                  {buttonStates.colorful ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="bw.jpg" alt="B&W" />
                <h3>B&W</h3>
                <p>Experiment with black and white aesthetics for a classic touch.</p>
                <button
                  className={buttonStates.bw ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('bw', 'style')}
                >
                  {buttonStates.bw ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="logo.jpg" alt="Logo" />
                <h3>Logo</h3>
                <p>Create captivating logo designs with unique artistic styles.</p>
                <button
                  className={buttonStates.logo ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('logo', 'style')}
                >
                  {buttonStates.logo ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="minimalist.jpg" alt="Minimalist" />
                <h3>Minimalist</h3>
                <p>Embrace simplicity and elegance with minimalist art styles.</p>
                <button
                  className={buttonStates.minimalist ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('minimalist', 'style')}
                >
                  {buttonStates.minimalist ? 'ON' : 'OFF'}
                </button>             
              </div>
              <div className="style-button">
                <img src="intricatedetails.jpg" alt="Intricated Details" />
                <h3>Intricated Details</h3>
                <p>Add intricate and detailed elements to your artwork for a captivating effect.</p>
                <button
                  className={buttonStates.intricatedetails ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('intricatedetails', 'style')}
                >
                  {buttonStates.intricatedetails ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="highcontrast.jpg" alt="High Contrast" />
                <h3>High Contrast</h3>
                <p>Create bold and striking compositions with high contrast styles.</p>
                <button
                  className={buttonStates.highcontrast ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('highcontrast', 'style')}
                >
                  {buttonStates.highcontrast ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="patchdesign.jpg" alt="Patch Design" />
                <h3>Patch Design</h3>
                <p>Design unique patches with custom artwork and vibrant colors.</p>
                <button
                  className={buttonStates.patchdesign ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('patchdesign', 'style')}
                >
                  {buttonStates.patchdesign ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="vectorlineart.jpg" alt="Vector Line Art" />
                <h3>Vector Line Art</h3>
                <p>Explore clean and precise line work with vector-based art styles.</p>
                <button
                  className={buttonStates.vectorlineart ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('vectorlineart', 'style')}
                >
                  {buttonStates.vectorlineart ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="realistic.jpg" alt="Realistic" />
                <h3>Realistic</h3>
                <p>Achieve lifelike representations and detailed realism in your artwork.</p>
                <button
                  className={buttonStates.realistic ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('realistic', 'style')}
                >
                  {buttonStates.realistic ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            <div className="style-section">
              <h2 className="section-title">Advanced Styles</h2>
              <div className="style-button">
                <img src="myasaki.jpg" alt="Myasaki" />
                <h3>Myasaki</h3>
                <p>Pay tribute to the imaginative and whimsical world of Myasaki.</p>
                <button
                  className={buttonStates.myasaki ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('myasaki', 'style')}
                >
                  {buttonStates.myasaki ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="steampunk.jpg" alt="Steampunk" />
                <h3>Steampunk</h3>
                <p>Combine Victorian aesthetics with futuristic steam-powered technology.</p>
                <button
                  className={buttonStates.steampunk ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('steampunk', 'style')}
                >
                  {buttonStates.steampunk ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="disney.jpg" alt="Disney" />
                <h3>Disney</h3>
                <p>Bring the magic of Disney to your artwork with enchanting styles.</p>
                <button
                  className={buttonStates.disney ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('disney', 'style')}
                >
                  {buttonStates.disney ? 'ON' : 'OFF'}
                </button>            
              </div>
              <div className="style-button">
                <img src="watercolor.jpg" alt="Watercolor" />
                <h3>Watercolor</h3>
                <p>Immerse your art in the fluid beauty of watercolor painting.</p>
                <button
                  className={buttonStates.watercolor ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('watercolor', 'style')}
                >
                  {buttonStates.watercolor ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="oilpainting.jpg" alt="OilPainting" />
                <h3>Oil Painting</h3>
                <p>Emulate the rich textures and colors of traditional oil paintings.</p>
                <button
                  className={buttonStates.oilpainting ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('oilpainting', 'style')}
                >
                  {buttonStates.oilpainting ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="sculpture.jpg" alt="Sculpture" />
                <h3>Sculpture</h3>
                <p>Explore the three-dimensional artistry of sculptural styles.</p>
                <button
                  className={buttonStates.sculpture ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('sculpture', 'style')}
                >
                  {buttonStates.sculpture ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="vaporwave.jpg" alt="VaporWave" />
                <h3>VaporWave</h3>
                <p>Take inspiration from the retro-futuristic aesthetics of VaporWave.</p>
                <button
                  className={buttonStates.vaporwave ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('vaporwave', 'style')}
                >
                  {buttonStates.vaporwave ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="digitalart.jpg" alt="Digital Art" />
                <h3>Digital Art</h3>
                <p>Discover the endless possibilities of digital art styles.</p>
                <button
                  className={buttonStates.digitalart ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('digitalart', 'style')}
                >
                  {buttonStates.digitalart ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="conceptart.jpg" alt="Concept Art" />
                <h3>Concept Art</h3>
                <p>Bring your imaginative ideas to life with concept art styles.</p>
                <button
                  className={buttonStates.conceptart ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('conceptart', 'style')}
                >
                  {buttonStates.conceptart ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="pixar.jpg" alt="Pixar" />
                <h3>Pixar</h3>
                <p>Capture the charm and storytelling magic of Pixar animation.</p>
                <button
                  className={buttonStates.pixar ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('pixar', 'style')}
                >
                  {buttonStates.pixar ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="japanesestyle.jpg" alt="Japanese Style" />
                <h3>Japanese Style</h3>
                <p>Embrace the beauty and elegance of traditional Japanese art.</p>
                <button
                  className={buttonStates.japanesestyle ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('japanesestyle', 'oriental style')}
                >
                  {buttonStates.japanesestyle ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="handpoked.jpg" alt="Hand Poked" />
                <h3>Hand Poked</h3>
                <p>Create unique and intricate art with hand-poked tattoo styles.</p>
                <button
                  className={buttonStates.handpoked ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('handpoked', 'style')}
                >
                  {buttonStates.handpoked ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="americanoldschool.jpg" alt="American Old School" />
                <h3>American Old School</h3>
                <p>Celebrate the nostalgia of American traditional tattoo styles.</p>
                <button
                  className={buttonStates.americanoldschool ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('americanoldschool', 'style')}
                >
                  {buttonStates.americanoldschool ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="style-button">
                <img src="vintage.jpg" alt="Vintage" />
                <h3>Vintage</h3>
                <p>Transport your art to the past with vintage-inspired styles.</p>
                <button
                  className={buttonStates.vintage ? 'button-on' : 'button-off'}
                  onClick={() => handleButtonToggle('vintage', 'style')}
                >
                  {buttonStates.vintage ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
        </div>
      </div>

      <div className="tab-content" id="formatTab" style={{ display: activeTab === 'Format' ? 'block' : 'none' }}>
        <div className="format-button">
          <img src="closeup.jpg" alt="Close Up" />
          <h3>Close Up</h3>
          <p>Focus on capturing intricate details with close-up shots.</p>
          <button
            className={buttonStates.closeup ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('closeup', 'format')}
          >
            {buttonStates.closeup ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="format-button">
          <img src="longshot.jpg" alt="Long Shot" />
          <h3>Long Shot</h3>
          <p>Emphasize the subject's surroundings and context with long shots.</p>
          <button
            className={buttonStates.longshot ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('longshot', 'format')}
          >
            {buttonStates.longshot ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="format-button">
          <img src="landscape.jpg" alt="Landscape" />
          <h3>Landscape</h3>
          <p>Capture the beauty and vastness of natural landscapes.</p>
          <button
            className={buttonStates.landscape ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('landscape', 'format')}
          >
            {buttonStates.landscape ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="format-button">
          <img src="background.jpg" alt="Background" />
          <h3>Background</h3>
          <p>Enhance your artwork by focusing on background elements and scenery.</p>
          <button
            className={buttonStates.background ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('background', 'format')}
          >
            {buttonStates.background ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="format-button">
          <img src="portrait.jpg" alt="Portrait" />
          <h3>Portrait</h3>
          <p>Create compelling character portraits with distinct personalities.</p>
          <button
            className={buttonStates.portrait ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('portrait', 'format')}
          >
            {buttonStates.portrait ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="tab-content" id="modeleTab" style={{ display: activeTab === 'Modèle' ? 'block' : 'none' }}>
        <div className="model-button">
          <img src="automatic.jpg" alt="Automatic 11.11" />
          <h3>Automatic 11.11</h3>
          <p>Discover the magic of automatic generation with AI-powered 11.11 models.</p>
          <button
            className={buttonStates.automatic1111 ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('automatic1111', 'model')}
          >
            {buttonStates.automatic1111 ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="model-button">
          <img src="redream.jpg" alt="Redream" />
          <h3>Redream</h3>
          <p>Bring your wildest dreams to life with the enchanting Redream model.</p>
          <button
            className={buttonStates.redream ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('redream', 'model')}
          >
            {buttonStates.redream ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="model-button">
          <img src="arcane_diffusion.jpg" alt="Arcane Diffusion" />
          <h3>Arcane Diffusion</h3>
          <p>Unleash the mystical and arcane with the powerful Diffusion model.</p>
          <button
            className={buttonStates.arcanediffusion ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('arcanediffusion', 'model')}
          >
            {buttonStates.arcanediffusion ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="model-button">
          <img src="wand-ducstyle.jpg" alt="Wand-Ducstyle" />
          <h3>Wand-Ducstyle</h3>
          <p>Experience the unique style of Wand-Ducstyle for truly mesmerizing creations.</p>
          <button
            className={buttonStates.wandducstyle ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('wandducstyle', 'model')}
          >
            {buttonStates.wandducstyle ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="model-button">
          <img src="GTA5_artwork_diffusion.jpg" alt="GTA5 Artwork Diffusion" />
          <h3>GTA5 Artwork Diffusion</h3>
          <p>Blend the worlds of GTA5 and artwork with the Artwork Diffusion model.</p>
          <button
            className={buttonStates.gta5artworkdiffusion ? 'button-on' : 'button-off'}
            onClick={() => handleButtonToggle('gta5artworkdiffusion', 'model')}
          >
            {buttonStates.gta5artworkdiffusion ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="tab-content" id="parametresTab" style={{ display: activeTab === 'Paramètres' ? 'block' : 'none' }}>
        <div className="parametre">
          <label htmlFor="imageWidth">Image Width:</label>
          <input
            type="range"
            id="imageWidth"
            min="100"
            max="1000"
            step="10"
            value={imageWidth}
            onChange={handleImageWidthChange}
          />
          <input
            type="text"
            value={imageWidth}
            onChange={handleImageWidthChange}
          />
        </div>
        <div className="parametre">
          <label htmlFor="imageHeight">Image Height:</label>
          <input
            type="range"
            id="imageHeight"
            min="100"
            max="1000"
            step="10"
            value={imageHeight}
            onChange={handleImageHeightChange}
          />
          <input
            type="text"
            value={imageHeight}
            onChange={handleImageHeightChange}
          />
        </div>
        <div className="parametre">
          <label htmlFor="seed">Seed:</label>
          <input
            type="text"
            id="seed"
            value={seed}
            onChange={handleSeedChange}
          />
        </div>
        <div className="parametre">
          <label htmlFor="generationSteps">Generation Steps:</label>
          <input
            type="range"
            id="generationSteps"
            min="1"
            max="50"
            step="1"
            value={generationSteps}
            onChange={handleGenerationStepsChange}
          />
          <input
            type="number"
            value={generationSteps}
            onChange={handleGenerationStepsChange}
          />
        </div>
        <div className="parametre">
          <label htmlFor="guidanceScale">Guidance Scale:</label>
          <input
            type="range"
            id="guidanceScale"
            min="0"
            max="10"
            step="0.5"
            value={guidanceScale}
            onChange={handleGuidanceScaleChange}
          />
          <input
            type="number"
            step="0.5"
            value={guidanceScale}
            onChange={handleGuidanceScaleChange}
          />
        </div>
      </div>
      <div className="header">Gallery</div>
      <div className="gallery">
        {images.map((image) => (
          <img
            key={image._id}
            src={image.imageUrl}
            alt={image.prompt}
            className={selectedPhoto === image._id ? 'selected' : ''}
            onClick={() => handlePhotoClick(image._id)}
          />
        ))}
      </div>
      {selectedPhoto && (
        <div className="selected-photo">
          <img src={selectedPhoto.imageUrl} alt="Selected Image" className="selected-image" />
          <div className="caption">{selectedPhoto.prompt}</div>
        </div>
      )}
    </div>
  );
};

export default HomePage;