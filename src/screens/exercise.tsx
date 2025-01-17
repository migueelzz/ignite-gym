import {
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { Box } from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";
import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";
import { Button } from "@components/button";
import { useEffect, useState } from "react";
import { api } from "../http/api";
import { ExerciseDTO } from "@dtos/exercise-dto";
import { AppError } from "@utils/error";
import { ToastMessage } from "@components/toast-message";
import { Loading } from "@components/loading";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();

  const { exerciseId } = route.params as RouteParamsProps;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>();

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
      console.log(response.data);
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Não foi possível carregar os detalhes do exercício.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setIsSubmitting(true);

      await api.post('/history', { exercise_id: exerciseId });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Parabéns!"
            description="Exercício foi registrado no seu histórico."
            onClose={() => toast.close(id)}
          />
        ),
      });

      navigation.navigate("history")
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Não foi possível registrar o exercício.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise?.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise?.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8">
          <Image
            source={{
              uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
            }}
            alt="Exercício"
            mb="$3"
            resizeMode="cover"
            rounded="$lg"
            w="$full"
            h="$80"
          />

          <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb="$6"
              mt="$5"
            >
              <HStack>
                <SeriesSvg />
                <Text color="$gray200" ml="$2">
                  {exercise?.series} séries
                </Text>
              </HStack>
              <HStack>
                <RepetitionSvg />
                <Text color="$gray200" ml="$2">
                  {exercise?.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button 
              title="Marcar como realizado" 
              isLoading={isSubmitting}
              onPress={handleExerciseHistoryRegister}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
