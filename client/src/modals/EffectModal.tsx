import { useEffect } from 'react';
import styled from 'styled-components';
import { Effect } from '../../shared/types.shared';
import { Blink } from '../components/Blink';
import { Body, Button, Spacing } from '../components/ui-kit';
import { useEffectStore } from '../services/useEffects';
import { useTypewriter } from '../services/useTypewriter';
import { EFFECT_BANNER_IMAGES } from '../utils/effect-images';

export function EffectModal() {
  const effects = useEffectStore((s) => s.effects);
  const setEffects = useEffectStore((s) => s.setEffects);

  useEffect(() => {
    setEffects([]);
  }, [setEffects]);

  // useTypewriterEffect(effects);
  if (effects.length === 0) return null;

  return <Modal effects={effects} />;
}

function Modal({ effects }: { effects: Effect[] }) {
  const removeEffect = useEffectStore((s) => s.removeEffect);
  const effect = effects[0];

  const message = useTypewriter(effect.messageToSelf, {
    intervalMs: 30,
    startingDelay: 1000,
  });

  const typewriterProgress = message.length / effect.messageToSelf.length;

  const bannerImage = EFFECT_BANNER_IMAGES?.[effect.id];
  return (
    <ModalWrapper>
      <Content>
        {bannerImage && <Banner src={bannerImage} />}
        <Body size="small">
          {message}
          {typewriterProgress > 0.9999 || <Blink>_</Blink>}
        </Body>

        <Centered>
          <Spacing y="2rem" />
          <FullButton
            $visible={typewriterProgress > 0.3}
            onClick={() => removeEffect(effect)}
          >
            Ok
          </FullButton>
        </Centered>
      </Content>
    </ModalWrapper>
  );
}

const Banner = styled.img`
  image-rendering: pixelated;
  /* filter: contrast(300%) brightness(150%) saturate(150%) grayscale(0.5); */
  // prettier-ignore
  filter: 
  grayscale(100%) 
  invert() 
  brightness(100%) 
  sepia(70%) 
  hue-rotate(60deg)
  saturate(350%);

  pointer-events: none;
`;

const FullButton = styled(Button)<{ $visible: boolean }>`
  width: 100%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 1s;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  animation: fadeIn 1s linear;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    33% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  background-color: rgba(0, 0, 0, 0.8);
`;

const Content = styled.div`
  border: 1px solid forestgreen;
  background-color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  padding: 1rem;
  margin: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
