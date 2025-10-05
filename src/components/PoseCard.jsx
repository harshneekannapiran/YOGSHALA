const PoseCard = ({ pose, onClick }) => {
  const getDifficultyColor = () => pose.difficulty==='Beginner'?'#81c784':pose.difficulty==='Intermediate'?'#ffca28':pose.difficulty==='Advanced'?'#e57373':'#a1887f';
  return <div className="pose-card" onClick={onClick}><div className="pose-image-container"><img src={pose.image} alt={pose.name} className="pose-image" /><span className="difficulty-badge" style={{backgroundColor:getDifficultyColor()}}>{pose.difficulty}</span></div><div className="pose-info"><h3>{pose.name}</h3><p className="pose-benefits">{pose.benefits}</p><p className="pose-duration">Duration: {pose.duration} seconds</p></div></div>;
};
export default PoseCard;