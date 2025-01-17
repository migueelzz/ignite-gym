import { HistoryCard } from "@components/history-card";
import { ScreenHeader } from "@components/screen-header";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { AppError } from "@utils/error";
import { useCallback, useState } from "react";
import { SectionList } from "react-native";
import { api } from "../http/api";
import { ToastMessage } from "@components/toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryGroupByDayDTO } from "@dtos/history-group-by-day-dto";

export function History() {
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryGroupByDayDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const response = await api.get("/history")
      setExercises(response.data)
      console.log(response.data)
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Não foi possível carregar o histórico.";

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

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <HistoryCard  data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            fontFamily="$heading"
            mt="$10"
            mb="$3"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            Não há exercícios registrados ainda. {"\n"}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
