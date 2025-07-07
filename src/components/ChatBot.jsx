import { useState } from 'react';
import '../styles/chatBot.css';

const ChatBot = ({ poses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: 'Welcome to Yogshala! I\'m your personal yoga guide. I can help you with pose recommendations, benefits, proper techniques, and personalized yoga sequences. What would you like to know about today?', 
      isBot: true 
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages(prev => [...prev, { text: inputValue, isBot: false }]);
    const botResponse = generateBotResponse(inputValue);

    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 500);

    setInputValue('');
  };

  const generateBotResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('back pain')) {
      const backPoses = poses.filter(p => p.benefits.toLowerCase().includes('back pain'));
      if (backPoses.length > 0) {
        return `For back pain relief, I recommend these therapeutic poses:\n\n${backPoses.map(p => 
          `• ${p.name} (${p.difficulty}): ${p.benefits}\n\nHow to do it: ${p.instructions}\n\nHold for ${p.duration} seconds, breathing deeply.`
        ).join('\n\n')}\n\nPractice these daily for best results. Remember to move gently and stop if you feel any sharp pain.`;
      }
      return `For back pain, I recommend these gentle therapeutic poses:\n\n1. Child's Pose (Beginner): Kneel on the floor, sit back on your heels, and stretch your arms forward to relieve lower back tension.\n\n2. Cat-Cow Stretch (Beginner): On hands and knees, alternate between arching your back upward (cat) and dipping it downward (cow) to increase spinal mobility.\n\n3. Supine Twist (Intermediate): Lie on your back and gently twist your knees to one side while keeping shoulders flat to release spinal tension.\n\nHold each pose for 30-60 seconds, breathing deeply into any areas of tightness.`;
    }

    if (lowerInput.includes('flexibility')) {
      const flexPoses = poses.filter(p => 
        p.benefits.toLowerCase().includes('flexibility') || 
        p.benefits.toLowerCase().includes('stretch')
      );
      return `To improve flexibility, I suggest this sequence:\n\n${flexPoses.map(p => 
        `• ${p.name}: ${p.benefits}\n\nTechnique: ${p.instructions}\n\nHold for ${p.duration} seconds, focusing on gradual deepening with each exhale.`
      ).join('\n\n')}\n\nFor optimal flexibility gains, practice this sequence 3-4 times per week, holding each pose a little longer each time. Remember to warm up first and never force your body beyond comfortable limits.`;
    }

    if (lowerInput.includes('strength')) {
      const strengthPoses = poses.filter(p => 
        p.benefits.toLowerCase().includes('strength') || 
        p.benefits.toLowerCase().includes('strengthen')
      );
      return `Building strength through yoga involves both holding poses and flowing between them. Here's a strength-building sequence:\n\n${strengthPoses.map(p => 
        `• ${p.name} (${p.difficulty}): Targets ${p.benefits.toLowerCase().includes('arms') ? 'upper body' : 
        p.benefits.toLowerCase().includes('legs') ? 'lower body' : 'core'} muscles\n\nProper form: ${p.instructions}\n\nHold for ${p.duration} seconds, engaging your muscles.`
      ).join('\n\n')}\n\nFor strength development, practice this sequence 3 times weekly, gradually increasing hold times. Combine with breath control (pranayama) for better muscle engagement.`;
    }

    if (lowerInput.includes('balance')) {
      const balancePoses = poses.filter(p => 
        p.benefits.toLowerCase().includes('balance') || 
        p.name.toLowerCase().includes('tree') ||
        p.name.toLowerCase().includes('eagle')
      );
      return `Improving balance requires both physical practice and mental focus. Try this balance sequence:\n\n${balancePoses.map(p => 
        `• ${p.name}: ${p.benefits}\n\nAlignment tips: ${p.instructions.replace('.', '.\n\n- Keep your gaze (drishti) fixed on one point\n- Engage your core muscles\n- Distribute weight evenly')}\n\nHold for ${p.duration} seconds on each side.`
      ).join('\n\n')}\n\nPractice near a wall for support if needed. Balance improves with consistent practice - try doing these poses daily, even for just a few minutes.`;
    }

    if (lowerInput.includes('tired') || lowerInput.includes('fatigue')) {
      return `When feeling tired, restorative yoga can be more beneficial than vigorous practice. Try this rejuvenating sequence:\n\n1. Legs-Up-the-Wall Pose (5-10 minutes): Lie on your back with legs vertically up a wall to drain tension and improve circulation.\n\n2. Supported Child's Pose (3-5 minutes): Place a bolster under your torso for deep relaxation.\n\n3. Corpse Pose with Eye Pillow (5+ minutes): Complete relaxation with attention to slow, diaphragmatic breathing.\n\nThese poses help reset your nervous system. Focus on complete surrender rather than perfect form. Add calming essential oils like lavender for enhanced relaxation.`;
    }

    if (lowerInput.includes('digestion')) {
      const twistPoses = poses.filter(p => 
        p.name.toLowerCase().includes('twist') || 
        p.benefits.toLowerCase().includes('digestion')
      );
      return `Yoga can significantly improve digestion through specific twists and compressions. Try this digestive sequence:\n\n${twistPoses.map(p => 
        `• ${p.name}: ${p.benefits}\n\nKey technique points: ${p.instructions}\n\nHold for ${p.duration} seconds, twisting deeper with each exhale.`
      ).join('\n\n')}\n\nPractice this sequence 1-2 hours after eating. Focus on the wringing-out action of twists to stimulate digestive organs. Combine with abdominal massage in Corpse Pose for enhanced benefits.`;
    }

    if (lowerInput.includes('pose') || lowerInput.includes('about')) {
      const foundPose = poses.find(p => lowerInput.includes(p.name.toLowerCase()));
      if (foundPose) {
        return `Let me tell you about ${foundPose.name} in detail:\n\n• Difficulty Level: ${foundPose.difficulty}\n\n• Primary Benefits: ${foundPose.benefits}\n\n• Step-by-Step Instructions:\n${foundPose.instructions}\n\n• Recommended Duration: ${foundPose.duration} seconds\n\n• Common Mistakes to Avoid:\n- Rushing into the pose without proper warmup\n- Holding breath instead of maintaining steady ujjayi breath\n- Overarching or rounding the spine incorrectly\n\n• Modifications:\n- Use props like blocks or straps if needed\n- Reduce hold time for beginners\n- Focus on alignment over depth\n\n• Complementary Poses: ${['Child\'s Pose', 'Downward Dog', 'Mountain Pose'].join(', ')}`;
      }
    }

    if (lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
      const randomPose = poses[Math.floor(Math.random() * poses.length)];
      return `Based on your practice today, I recommend ${randomPose.name}. Here's why:\n\n${randomPose.name} is a ${randomPose.difficulty.toLowerCase()} level pose that offers these benefits:\n\n• ${randomPose.benefits}\n\nTo practice it safely:\n\n1. ${randomPose.instructions}\n\n2. Hold for ${randomPose.duration} seconds, breathing deeply\n\n3. Focus on proper alignment over depth\n\n4. Modify as needed using props\n\nThis pose would complement your recent work on ${['flexibility', 'strength', 'balance'][Math.floor(Math.random() * 3)]}. Would you like me to suggest a sequence incorporating this pose?`;
    }

    if (lowerInput.includes('beginner') || lowerInput.includes('easy') || lowerInput.includes('new')) {
      const beginnerPoses = poses.filter(p => p.difficulty === 'Beginner');
      return `Welcome to your yoga journey! Here's a complete beginner-friendly sequence:\n\n${beginnerPoses.map(p => 
        `• ${p.name}:\n- Benefits: ${p.benefits}\n- How to: ${p.instructions}\n- Hold for: ${p.duration} seconds\n- Modification: ${p.name.includes('Dog') ? 'Bend knees if hamstrings are tight' : 'Use blocks if needed'}`
      ).join('\n\n')}\n\nPractice this sequence 3-4 times weekly, holding each pose for 3-5 breaths. Remember:\n\n1. Focus on breathing deeply\n2. Don't push into pain\n3. Use props generously\n4. Progress gradually\n\nWould you like me to explain any of these poses in more detail?`;
    }

    if (lowerInput.includes('advanced') || lowerInput.includes('challenging')) {
      const advancedPoses = poses.filter(p => p.difficulty === 'Advanced');
      return `For advanced practitioners, I recommend this challenging sequence:\n\n${advancedPoses.map(p => 
        `• ${p.name}:\n- Key Benefits: ${p.benefits}\n- Precautions: ${p.name.includes('Headstand') ? 'Avoid if neck issues' : 'Ensure proper warmup'}\n- Technique: ${p.instructions}\n- Hold for: ${p.duration} seconds\n- Progression: ${p.name.includes('Crow') ? 'Work toward straight arms' : 'Increase hold time'}`
      ).join('\n\n')}\n\nImportant safety notes for advanced practice:\n\n1. Always warm up thoroughly\n2. Practice near a wall when attempting inversions\n3. Listen to your body's limits\n4. Consider working with a teacher\n\nWould you like modifications for any of these poses?`;
    }

    if (lowerInput.includes('stress') || lowerInput.includes('anxiety') || lowerInput.includes('relax')) {
      return `Yoga is incredibly effective for stress relief. Try this calming sequence:\n\n1. Alternate Nostril Breathing (3-5 minutes): Balances the nervous system\n\n2. Forward Fold (1-2 minutes): Releases tension in back and hamstrings\n\n3. Supported Bridge Pose (3-5 minutes): Place a block under your sacrum\n\n4. Legs-Up-the-Wall (5-10 minutes): The ultimate relaxation pose\n\n5. Corpse Pose with Guided Relaxation (5+ minutes): Systematically relax each body part\n\nAdditional stress-reducing tips:\n\n• Practice in a quiet, dimly lit space\n• Use calming essential oils like lavender\n• Focus on lengthening your exhalations\n• Allow at least 5 minutes for final relaxation\n\nThis sequence works best when practiced daily, especially in the evening.`;
    }

    if (lowerInput.includes('sequence') || lowerInput.includes('routine')) {
      const morningSequence = poses.filter(p => 
        ['Mountain Pose', 'Downward Dog', 'Warrior II', 'Tree Pose', 'Bridge Pose'].includes(p.name)
      );
      return `Here's a balanced 20-minute morning sequence to energize your day:\n\n${morningSequence.map((p, i) => 
        `${i+1}. ${p.name} (${p.duration} seconds):\n- ${p.instructions}\n- Benefits: ${p.benefits}`
      ).join('\n\n')}\n\nSequence Flow:\n\n1. Start with 3 rounds of Sun Salutations to warm up\n2. Perform each pose for ${morningSequence[0].duration} seconds\n3. Connect movements with your breath\n4. Finish with 1 minute of seated meditation\n\nFor evening relaxation, replace with: Child's Pose, Seated Forward Bend, Supine Twist, and Legs-Up-the-Wall.`;
    }

    return `Thank you for your question! As your yoga assistant, I can provide detailed information about:\n\n• Specific poses (technique, benefits, precautions)\n• Personalized sequences for different goals\n• Yoga for particular needs (back pain, stress, flexibility)\n• Breathing techniques (pranayama)\n• Meditation guidance\n\nFor example, you could ask:\n\n"Show me a sequence for back pain"\n"Explain Tree Pose in detail"\n"Suggest poses to improve posture"\n"What yoga helps with anxiety?"\n\nHow would you like me to assist you with your yoga practice today?`;
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Yoga Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="close-button">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                {message.text.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about yoga poses, sequences, or benefits..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <button 
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
        >
          🧘 Ask Yoga Assistant
        </button>
      )}
    </div>
  );
};

export default ChatBot;