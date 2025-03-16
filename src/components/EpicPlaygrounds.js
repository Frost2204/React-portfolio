import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Sample game data with genres
const games = [
  { name: 'Assassins Creed', image: 'https://i.pinimg.com/736x/4e/74/a7/4e74a72eb6fe398fba8482d16bfc7367.jpg', rating: '10/10', genres: ['Action', 'Open World', 'Adventure'] },
  { name: 'Marvel Spider-Man Series', image: 'https://i.pinimg.com/736x/a0/7e/eb/a07eeb846f05daa0554bdfd609f3fcb7.jpg', rating: '10/10', genres: ['Action', 'Open World', 'Superhero'] },
  { name: 'Split Fiction', image: 'https://i.pinimg.com/736x/ba/f8/0f/baf80f66181bd1052c2ab144d4ee9a6d.jpg', rating: '10/10', genres: ['Fighting', 'Multiplayer', 'Action'] },
  { name: 'A Plague Tale Series', image: 'https://i.pinimg.com/736x/3a/ee/22/3aee22120153a8314587d81ee803d1ed.jpg', rating: '10/10', genres: ['Stealth', 'Adventure', 'Story-driven'] },
  { name: 'Ghost Of Tsushima', image: 'https://i.pinimg.com/736x/aa/65/be/aa65be39f98195b92ee2239b97c9866e.jpg', rating: '10/10', genres: ['Action', 'Open World', 'Samurai'] },
  { name: 'God Of War', image: 'https://i.pinimg.com/736x/8f/b8/64/8fb86497c97e85957e98bc3f68823ade.jpg', rating: '10/10', genres: ['Action', 'Adventure', 'Mythology'] },
  { name: 'Red Dead Redemption 2', image: 'https://i.pinimg.com/736x/06/18/28/061828b79ddfbec758f17fa2317b4ecf.jpg', rating: '10/10', genres: ['Western', 'Adventure', 'Open World'] },
  { name: 'No Man’s Sky', image: 'https://i.pinimg.com/736x/2a/c4/f0/2ac4f0a3d26368fe79c1eaa4bbb89cfb.jpg', rating: '9/10', genres: ['Survival', 'Open World', 'Space Exploration'] },
  { name: 'Fire Watch', image: 'https://i.pinimg.com/736x/ab/83/80/ab8380f0975106a59af3cb8c752b0099.jpg', rating: '9/10', genres: ['Indie', 'Adventure', 'Calm'] },
  { name: 'Prince Of Persia Series', image: 'https://i.pinimg.com/736x/8b/51/25/8b5125956ed6ad1016873f4c5ad093b0.jpg', rating: '9/10', genres: ['Action', 'Adventure', 'Platformer'] },
  { name: 'Elden Ring', image: 'https://i.pinimg.com/736x/cc/b6/f0/ccb6f0689bcaa9b205f6593cc6a4182c.jpg', rating: '9/10', genres: ['RPG', 'Open World', 'Soulslike'] },
  { name: 'Batman Arkham Series', image: 'https://i.pinimg.com/736x/4b/bb/0b/4bbb0b3b2357f555d7255f9e6b7dffbb.jpg', rating: '9/10', genres: ['Action', 'Stealth', 'Superhero'] },
  { name: 'Hollow Knight', image: 'https://i.pinimg.com/736x/19/b4/cc/19b4cc0c291c49a0416398d4fcbc0c7b.jpg', rating: '9/10', genres: ['Metroidvania', 'Indie', 'Adventure'] },
  { name: 'Sekiro: Shadows Die Twice', image: 'https://i.pinimg.com/736x/42/12/46/421246f3bbe9f9fb54a57b6ceeb9496a.jpg', rating: '9/10', genres: ['Action', 'Adventure', 'Soulslike'] },
  { name: 'Borderlands 3', image: 'https://i.pinimg.com/736x/e7/b6/69/e7b669e01026d62e1e87ce8b48b06bb3.jpg', rating: '9/10', genres: ['FPS', 'RPG', 'Co-op'] },
  { name: 'Cyberpunk 2077', image: 'https://i.pinimg.com/736x/b6/2e/b6/b62eb6f80aa4fc27f502f0b8c51ef8c6.jpg', rating: '8/10', genres: ['RPG', 'Open World', 'FPS'] },
  { name: 'Prototype 1/2', image: 'https://i.pinimg.com/736x/6d/72/12/6d72120515a2b064bafefcbb6c26dd0c.jpg', rating: '8/10', genres: ['Action', 'Open World', 'Superpowers'] },
  { name: 'GTA Series', image: 'https://i.pinimg.com/736x/82/2c/7b/822c7bac0cfb47d2f5e9bc52464b7654.jpg', rating: '8/10', genres: ['Action', 'Open World', 'Crime'] },
  { name: 'Raji: An Ancient Epic', image: 'https://i.pinimg.com/736x/a3/f4/c3/a3f4c3d208d98824ac7f1f390b98bd0a.jpg', rating: '7/10', genres: ['Action', 'Adventure', 'Indie'] },
  { name: 'Valorant', image: 'https://i.pinimg.com/736x/b7/cf/62/b7cf62846ae6ae5e96b35cf9d5e05a7c.jpg', rating: '7/10', genres: ['FPS', 'Multiplayer', 'Competitive'] },
  { name: 'Forza Horizon Series', image: 'https://i.pinimg.com/736x/83/61/7a/83617a2251c061ee3c6a7527c4b2706d.jpg', rating: '7/10', genres: ['Racing', 'Open World', 'Simulation'] },
  { name: 'A Way Out', image: 'https://i.pinimg.com/736x/35/0f/5e/350f5e2c77c6634d4dcee5b4f4f15fc1.jpg', rating: '7/10', genres: ['Co-op', 'Adventure', 'Action'] },
  { name: 'Crew 2', image: 'https://i.pinimg.com/736x/53/5e/e2/535ee2bd3da4515bcf3dd16deef85078.jpg', rating: '6/10', genres: ['Racing', 'Open World', 'Multiplayer'] },
  { name: 'Warframe', image: 'https://i.pinimg.com/736x/cd/89/9a/cd899a2f845c097c3093153622525e81.jpg', rating: '6/10', genres: ['RPG', 'Shooter', 'Multiplayer'] },
];


// Styled components
const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '20px',
  padding: '20px',
  justifyContent: 'center',
  [theme.breakpoints.up('xs')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

const GameCard = styled(Box)({
  textAlign: 'center',
  borderRadius: '15px',
  overflow: 'hidden',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  boxShadow: '0 0 10px #fff',
  transition: 'transform 0.3s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const GameImage = styled('img')({
  width: '100%',
  aspectRatio: '1/1',
  objectFit: 'cover',
  borderRadius: '15px 15px 0 0',
});

const GenreBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '5px',
  marginTop: '10px',
});

const GenreTag = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '5px 10px',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff',
});

// Special Badge for 10/10 Games
const SpecialBadge = styled(Box)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#FFD700',
  color: '#000',
  padding: '5px 10px',
  borderRadius: '10px',
  fontWeight: 'bold',
});

const EpicPlaygrounds = () => {
  const [visibleGames, setVisibleGames] = useState(8);
  const [expanded, setExpanded] = useState(false);

  const toggleGames = () => {
    setExpanded(!expanded);
    setVisibleGames(expanded ? 8 : games.length);
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: { xs: '100%', sm: '95%' },
        margin: '30px auto',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 0 10px #ffff',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '50px', color: '#fff', marginBottom: '20px' }}>
        My Favorite Games
      </Typography>
      <Typography variant="h6" sx={{ color: '#ccc', marginBottom: '20px' }}>
        Gaming has been a big part of my journey, shaping my creativity and understanding of game mechanics. Over the
        years, I’ve explored a wide variety of titles across different genres, from action-packed adventures to
        immersive RPGs and strategy games. While I may not recall every single title, I have played most of the games on
        my list, gaining valuable insights into gameplay design, mechanics, and storytelling.
      </Typography>
      <ScrollContainer>
        {games.slice(0, visibleGames).map((game, index) => (
          <GameCard key={index}>
            {game.rating === '10/10' && <SpecialBadge>⭐ 10/10</SpecialBadge>}
            <GameImage src={game.image} alt={game.name} />
            <Typography variant="h6" sx={{ color: '#fff', padding: '10px 0' }}>{game.name}</Typography>
            <GenreBox>
              {game.genres.map((genre, i) => (
                <GenreTag key={i}>{genre}</GenreTag>
              ))}
            </GenreBox>
            <Typography variant="body1" sx={{ color: '#90A4AE', paddingBottom: '10px' }}>{game.rating}</Typography>
          </GameCard>
        ))}
      </ScrollContainer>
      {games.length > 8 && (
        <Button
          variant="contained"
          onClick={toggleGames}
          sx={{
            marginTop: '20px',
            backgroundColor: '#ff9800',
            '&:hover': { backgroundColor: '#e68900' },
          }}
        >
          {expanded ? 'Hide' : 'Load More'}
        </Button>
      )}
    </Box>
  );
};

export default EpicPlaygrounds;
