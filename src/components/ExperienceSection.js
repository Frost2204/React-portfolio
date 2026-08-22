import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";

const companyLogo = "https://myyhashstash.com/images/hashlogo.png";

const experiences = [
  {
    company: "MYYHASHSTASH",
    role: "Game Developer",
    period: "May 2025 - Present",
    image: companyLogo,
    hoverGif: companyLogo,
    website: "https://myyhashstash.com/",
    skills: ["Unity", "Blender", "Three.js", "AR Projects", "Friebase"],
    description:
      "Working on game development and interactive experiences across Unity, Blender, Three.js, and augmented reality projects.",
    works: [
      {
        name: "Breaking Blocks - Block Blast",
        image:
          "https://play-lh.googleusercontent.com/kvEsmAh9bNBowUaCytdAyDRqqZ0xTttFswPsc-kZYBNAFRTQ0c3rrIl8DL7I19vrU8DB6QmvaMhf5IpI48rRvA=w480-h960-rw", // TODO: replace with your project image import
        hoverGif:
          "https://play-lh.googleusercontent.com/4MH1lCDxHseUgJKZSpnBCBSTMRu6pVsZ39OrP43LZ3ksaUISYUbsfq2mYNb9cW-H1zwz6eC8TpinIlSLuSlX=w1052-h592-rw", // TODO: replace with your project gif import
        skills: ["Unity", "C#", "Firebase", "Level Play"],
        description:
          "Developed a casual block-breaking game with dynamic themes that change as players progress, featuring custom Unity shaders, interactive hover effects, animations, and particle effects. Implemented level-based gameplay with progressive difficulty and structured progression.",
        link: "https://play.google.com/store/apps/details?id=com.myyhashstash.breakingblocks",
      },
      {
        name: "Wordventure - Word Explorer",
        image:
          "https://play-lh.googleusercontent.com/X1E2CaGhxvaOgpjQWr-mkLPaxy5wjWofXs37nUMc1Js9X8Moxl9KGPSAMRVM1CGBeBdhryYwCmIaET6i8awy=s96-rw",
        hoverGif: "https://www.youtube.com/watch?v=FxpHGPbnKrg",
        skills: ["Unity", "C#", "Firebase", "Level Play"],
        description:
          "Developed a word puzzle game featuring themed levels, special levels, progression systems, and in-game currencies. Integrated Firebase for analytics, player data, and progression, along with rewarded and level-based advertisements. Implemented economy and reward systems to enhance player engagement and retention.",
        link: "https://play.google.com/store/apps/details?id=com.myyhashstash.wordventure",
      },
      {
        name: "Interactive Motorcycle Showroom",
        image:
          "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/5b7a3c29893579.565421847276c.jpg",
        hoverGif:
          "https://myyhashstash.com/assets/videos/honda-configurator.mp4",
        skills: ["Unity", "C#", "Addressables", "3D"],
        description:
          "Built an interactive 3D motorcycle configurator showroom using Unity Addressables, reducing initial load time by 45% through efficient asset streaming. Implemented bike and component customization, location-based pricing, dynamic price updates, and a final configuration summary, allowing users to explore bikes and customize individual parts before viewing the complete price.",
        link: "",
      },
      {
        name: "Casual Game Development",
        image:
          "https://tse2.mm.bing.net/th/id/OIP.Dk7XfZUM2qrMLfCEIxfk4QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        hoverGif: "https://myyhashstash.com/assets/videos/game-dev-video.mp4",
        skills: ["Unity", "C#", "2D", "3D", "WebGL", "Firebase"],
        description:
          "Worked on multiple casual games across mobile and WebGL platforms, developing gameplay systems, level progression, UI, animations, player economies, and monetization features. Implemented Firebase services, advertisements, analytics, and optimized game performance for smooth cross-platform experiences.",
        link: "",
      },
    ],
  },
];

// --- helpers to figure out what kind of media a "hoverGif" actually is ---

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
};

const isVideoFile = (url) => !!url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

/**
 * Renders `src` normally, and swaps to `hoverSrc` when `hovered` is true.
 * Handles three cases for hoverSrc: a plain image, an .mp4/.webm/.ogg file
 * (rendered as a real <video>, autoplaying + looping), or a YouTube link
 * (rendered as an embedded, autoplaying iframe).
 *
 * NOTE: this component no longer tracks its own hover state - `hovered` is
 * now a controlled prop so that hovering ANYWHERE on the parent card (not
 * just the thumbnail itself) can trigger the media swap.
 */
const HoverMedia = ({ src, hoverSrc, alt, imgClassName, hovered }) => {
  const youTubeId = hovered ? getYouTubeId(hoverSrc) : null;
  const showVideo = hovered && !youTubeId && isVideoFile(hoverSrc);
  const showImage = !youTubeId && !showVideo;

  return (
    <div className="absolute inset-0 w-full h-full">
      {showImage && (
        <img
          src={hovered && hoverSrc && !youTubeId && !showVideo ? hoverSrc : src}
          alt={alt}
          className={imgClassName}
        />
      )}

      {showVideo && (
        <video
          className={imgClassName}
          src={hoverSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {youTubeId && (
        <iframe
          className={imgClassName}
          style={{ border: 0 }}
          src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=1&loop=1&playlist=${youTubeId}&controls=0&modestbranding=1&rel=0`}
          title={alt}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};

// Shared hover-glow style: solid white border + strong white glow.
const hoverGlowSx = {
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
  transition:
    "box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s ease",
  "&:hover": {
    borderColor: "#ffffff",
    boxShadow: "0 0 24px rgba(255, 255, 255, 0.85)",
  },
};

const ExperienceSection = () => {
  const [visible, setVisible] = useState({
    title: false,
    subtitle: false,
  });
  // Track hover per experience card (by index) and per work card (by "expIndex-workIndex")
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [hoveredWork, setHoveredWork] = useState(null);
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targetId = entry.target.getAttribute("data-id");
          setVisible((prev) => ({
            ...prev,
            [targetId]: entry.isIntersecting,
          }));
        });
      },
      {
        threshold: 0.1,
      },
    );

    const elements = document.querySelectorAll(".experience-fade-item");
    elements.forEach((element) => observer.observe(element));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="px-4 sm:px-6 py-6 w-full"
      id="experience"
      style={{ overflowX: "hidden" }}
    >
      <Typography
        variant="h1"
        className={`experience-fade-item text-center mb-4 transition-all duration-700 ${
          visible.title
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-5"
        }`}
        data-id="title"
      >
        <span className="text-[32px] xs:text-[38px] sm:text-[46px] md:text-[52px] lg:text-[60px] font-bold leading-tight">
          Experience in Game Industry
        </span>
      </Typography>

      <Typography
        className={`experience-fade-item text-center mb-8 transition-all duration-700 text-sm sm:text-base ${
          visible.subtitle
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-5"
        }`}
        data-id="subtitle"
      >
        Professional game development work with Unity, Godot, Blender, Three.js,
        and AR.
      </Typography>

      {/* Container is now 90% of the viewport width on all screen sizes,
          capped at a sensible max-width on very large monitors so lines
          of text/cards don't stretch too far. */}
      <div className="grid grid-cols-1 w-[90%] max-w-[1600px] mx-auto pt-6 sm:pt-10">
        {experiences.map((experience, index) => (
          <Box
            key={experience.company}
            className={`experience-fade-item p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-700 ${
              visible[index]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
            data-id={index}
            onMouseEnter={() => setHoveredCompany(index)}
            onMouseLeave={() => setHoveredCompany(null)}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(10px)",
              ...hoverGlowSx,
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr",
                  md: "220px 1fr",
                  lg: "280px 1fr",
                },
                gap: { xs: 2, sm: 3 },
                alignItems: "center",
              }}
            >
              <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-none mx-auto md:mx-0 pb-[100%] rounded-lg overflow-hidden group">
                <HoverMedia
                  src={experience.image}
                  hoverSrc={experience.hoverGif}
                  alt={`${experience.company} logo`}
                  imgClassName="absolute inset-0 w-full h-full object-contain rounded-lg transition-all duration-300 bg-black/50 p-6 group-hover:scale-105"
                  hovered={hoveredCompany === index}
                />
              </div>

              <Box className="text-center md:text-left">
                <Typography
                  variant="h4"
                  className="font-bold text-2xl sm:text-3xl md:text-4xl"
                >
                  {experience.company}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#ffffff", marginTop: 1 }}
                >
                  {experience.role}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#cccccc", marginTop: 1 }}
                >
                  {experience.period}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#d6d6d6", marginTop: 2 }}
                >
                  {experience.description}
                </Typography>

                <div className="flex justify-center md:justify-start flex-wrap gap-2 mt-5 mb-0">
                  {experience.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      className="rounded-full"
                      color="primary"
                      variant="outlined"
                      style={{ padding: "4px 8px" }}
                    />
                  ))}
                </div>

                <Box className="flex justify-center md:justify-start mt-5">
                  <Button
                    variant="outlined"
                    href={experience.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      borderRadius: "20px",
                      padding: "8px 16px",
                      border: "2px solid white",
                      color: "white",
                      backgroundColor: "transparent",
                      "&:hover": {
                        border: "2px solid white",
                        boxShadow: "0 0 14px rgba(255, 255, 255, 0.55)",
                      },
                    }}
                  >
                    Visit Company
                  </Button>
                </Box>
              </Box>
            </Box>

            {experience.works && experience.works.length > 0 && (
              <Box
                sx={{ position: "relative", zIndex: 1, mt: { xs: 4, sm: 6 } }}
              >
                <Typography
                  variant="h6"
                  className="font-bold"
                  sx={{ mb: 3, color: "#ffffff" }}
                >
                  Work at {experience.company}
                </Typography>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {experience.works.map((work, workIndex) => {
                    const workKey = `${index}-${workIndex}`;
                    return (
                      <Box
                        key={workIndex}
                        className="p-4 sm:p-6 bg-[#232529] rounded-lg shadow-lg"
                        onMouseEnter={() => setHoveredWork(workKey)}
                        onMouseLeave={() => setHoveredWork(null)}
                        sx={{
                          backdropFilter: "blur(10px)",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "20px",
                          ...hoverGlowSx,
                        }}
                      >
                        <div className="relative w-full pb-[100%] rounded-lg overflow-hidden group mb-4">
                          <HoverMedia
                            src={work.image}
                            hoverSrc={work.hoverGif}
                            alt={work.name}
                            imgClassName="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300"
                            hovered={hoveredWork === workKey}
                          />
                        </div>
                        <Typography
                          variant="h6"
                          className="text-left mt-2 mb-2 px-2 sm:px-4 py-1 font-bold text-base sm:text-lg"
                        >
                          {work.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="px-2 sm:px-4 mb-2 text-gray-400 text-left py-1"
                        >
                          {work.description}
                        </Typography>
                        <div className="flex justify-start flex-wrap gap-2 px-2 sm:px-4 mt-5 mb-0">
                          {work.skills.map((skill, i) => (
                            <Chip
                              key={i}
                              label={skill}
                              className="rounded-full"
                              color="primary"
                              variant="outlined"
                              style={{ padding: "4px 8px" }}
                            />
                          ))}
                        </div>
                        {work.link && (
                          <Box className="flex justify-start px-2 sm:px-4 mt-4">
                            <Button
                              variant="outlined"
                              color="white"
                              href={work.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                borderRadius: "20px",
                                padding: "8px 16px",
                                border: "2px solid white",
                                backgroundColor: "transparent",
                              }}
                              className="hover:border-white hover:shadow-lg hover:shadow-slate-300"
                            >
                              View Project
                            </Button>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </div>
              </Box>
            )}
          </Box>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;
