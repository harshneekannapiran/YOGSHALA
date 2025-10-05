const DifficultyFilter = ({ selectedDifficulty, setSelectedDifficulty }) => (
  <div className="difficulty-filter">
    {["All","Beginner","Intermediate","Advanced"].map(difficulty => (
      <button key={difficulty} className={`difficulty-button ${selectedDifficulty===difficulty?"active":""}`} onClick={()=>setSelectedDifficulty(difficulty)}>{difficulty}</button>
    ))}
  </div>
);

export default DifficultyFilter;