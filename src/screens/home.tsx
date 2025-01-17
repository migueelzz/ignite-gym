import { ExerciseCard } from "@components/exercise-card";
import { Group } from "@components/group";
import { Header } from "@components/header";
import { ToastMessage } from "@components/toast-message";
import {
  Center,
  Heading,
  HStack,
  Text,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/error";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { api } from "../http/api";
import { ExerciseDTO } from "@dtos/exercise-dto";
import { Loading } from "@components/loading";

export function Home() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState("costas");

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", { exerciseId });
  }

  async function fetchGroups() {
    try {
      const response = await api.get("/groups");
      setGroups(response.data);

      // console.log(response.data);
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Não foi possível carregar os grupos musculares.";

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
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true);

      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);
      // console.log(response.data);
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Não foi possível carregar os exercícios.";

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
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <Header />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {
        isLoading ? <Loading /> : (
          <VStack px="$8" flex={1}>
            <HStack alignItems="center" justifyContent="space-between" mb="$5">
              <Heading color="$gray200" fontSize="$md">
                Exercícios
              </Heading>
    
              <Text color="$gray200" fontSize="$sm" fontFamily="$body">
                {exercises.length}
              </Text>
            </HStack>
    
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)} />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </VStack>
        )
      }
    </VStack>
  );
}
