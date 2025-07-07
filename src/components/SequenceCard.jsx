const SequenceCard = ({ sequence, onClick, onDelete, isDefault }) => (
  <div className="sequence-card">
    <div className="sequence-info" onClick={onClick}>
      <h3>{sequence.name}</h3>
      <p className="sequence-meta">{sequence.poses.length} poses • {Math.floor(sequence.totalDuration/60)} min {sequence.totalDuration%60} sec</p>
      <div className="pose-preview">
        {sequence.poses.slice(0,3).map((pose,i)=>(<span key={i} className="pose-tag">{pose.name}</span>))}
        {sequence.poses.length>3&&<span className="more-tag">+{sequence.poses.length-3} more</span>}
      </div>
    </div>
    {!isDefault&&<button className="delete-sequence-button" onClick={e=>{e.stopPropagation();onDelete(sequence._id||sequence.id);}} aria-label="Delete sequence">×</button>}
  </div>
);

export default SequenceCard;