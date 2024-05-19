import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';
import ViewShot from 'react-native-view-shot';

interface Props {
  isBlurred: boolean;
  onBlurred?: () => void;
  style: ViewStyle;
  children: React.ReactNode
}

export default function BlurryView({ isBlurred, onBlurred, style, children }: Props) {
  const viewShot = React.useRef<ViewShot>()

  const [blurredSrc, setBlurredSrc] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (isBlurred) {
      if (viewShot.current?.capture) {
        viewShot.current.capture().then(uri => {
          setBlurredSrc(uri)
        });
      }
    } else {
      setBlurredSrc(undefined)
    }
  }, [isBlurred])

  React.useEffect(() => {
    onBlurred?.()
  }, [blurredSrc])

  return (
    <ViewShot style={style} ref={viewShot as React.RefObject<ViewShot>}>
      {children}
      <Image
        resizeMode="cover"
        style={{
          ...styles.image,
          opacity: blurredSrc ? 1 : 0,
        }}
        blurRadius={2.5}
        source={{ uri: blurredSrc }}
      />
    </ViewShot>
  )
}


const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  }
})