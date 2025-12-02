import { Box, Text, Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function BioText({ bio, maxLength = 75, fontSize = 'sm', color = 'gray.600', textAlign = 'center' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio) return null;

  const shouldTruncate = bio.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? bio : `${bio.slice(0, maxLength)}...`;

  return (
    <Box>
      <Text
        fontSize={fontSize}
        color={color}
        textAlign={textAlign}
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        lineHeight="1.5"
      >
        {displayText}
      </Text>
      {shouldTruncate && (
        <Box textAlign={textAlign} mt={1}>
          <p
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </p>
        </Box>
      )}
    </Box>
  );
}

